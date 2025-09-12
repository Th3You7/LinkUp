import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';
import { FriendshipService } from '../../../core/services/friendship.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class MessageModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() friendId: string | null = null;
  @Input() friendName: string = '';
  @Input() friendUsername: string = '';
  @Output() closeModal = new EventEmitter<void>();

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private friendshipService = inject(FriendshipService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  messageText: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    // Subscribe to chat service state
    this.chatService.chatState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state.error) {
          this.error = state.error;
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  onSendMessage(): void {
    if (!this.messageText.trim() || !this.friendId || this.isLoading) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'You must be logged in to send messages';
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Create chat session and send message
    this.friendshipService
      .startChatWithFriend(this.friendId, currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (chatSession) => {
          // Send the initial message
          this.chatService.sendMessage({
            message: this.messageText,
            chatSessionId: chatSession.id,
            sender: currentUser.id,
            receiver: this.friendId || '',
          });

          // Close modal and navigate to chat
          this.onClose();
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          console.error('Failed to create chat session:', error);
          this.error = 'Failed to start conversation';
          this.isLoading = false;
        },
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  private resetForm(): void {
    this.messageText = '';
    this.error = null;
    this.isLoading = false;
  }
}
