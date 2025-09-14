import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  inject,
  Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../../core/services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-main-input',
  imports: [FormsModule],
  templateUrl: './chat-main-input.component.html',
  styleUrl: './chat-main-input.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatMainInputComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  @Input() friendId: string | null = null; // For new conversations
  messageText: string = '';
  disabled: boolean = false;
  currentSessionId: string | null = null;
  @Output() sendMessageEvent = new EventEmitter<string>();
  @Output() attachFileEvent = new EventEmitter<void>();
  @Output() addEmojiEvent = new EventEmitter<void>();
  @Output() voiceMessageEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Subscribe to current session
    this.chatService.chatState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.currentSessionId = state.currentSessionId || null;
        // Enable input if we have either a current session OR a friendId for new conversation
        this.disabled =
          (!this.currentSessionId && !this.friendId) ||
          !this.chatService.isWebSocketConnected();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(): void {
    if (!this.messageText.trim()) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      console.error('User not logged in');
      return;
    }

    let receiver: string | null = null;
    let chatSessionId: string | null = this.currentSessionId;

    if (this.currentSessionId) {
      // Existing conversation - get receiver from session participants
      receiver = this.chatService.getReceiverFromCurrentSession();
    } else if (this.friendId) {
      // New conversation - use the friendId as receiver
      receiver = this.friendId;
      chatSessionId = null; // Will be created by the backend
    }

    if (receiver) {
      this.chatService.sendMessage({
        message: this.messageText,
        chatSessionId: chatSessionId || '', // Empty string for new conversations
        sender: currentUser.id,
        receiver: receiver,
      });
      this.messageText = '';
    } else {
      console.error('No receiver found. Cannot send message.');
    }
  }

  onEnterPress(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.sendMessage();
    }
  }

  onAttachFile(): void {
    this.attachFileEvent.emit();
  }

  onAddEmoji(): void {
    this.addEmojiEvent.emit();
  }

  onVoiceMessage(): void {
    this.voiceMessageEvent.emit();
  }
}
