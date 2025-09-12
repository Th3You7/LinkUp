import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../../../core/services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatSession } from '../../../../core/models/chat.model';

@Component({
  selector: 'app-chat-main-header',
  imports: [CommonModule],
  templateUrl: './chat-main-header.component.html',
  styleUrl: './chat-main-header.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatMainHeaderComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  currentSession: ChatSession | null = null;
  currentSessionId: string | null = null;
  otherParticipant: any = null;
  isOnline: boolean = false; // For now, we'll assume all users are online

  ngOnInit(): void {
    // Subscribe to current session
    this.chatService.chatState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.currentSessionId = state.currentSessionId || null;

        if (this.currentSessionId) {
          // Find the current session from the sessions list
          const session = state.chatSessions.find(
            (s) => s.id === this.currentSessionId
          );
          if (session) {
            this.currentSession = session;
            this.setOtherParticipant();
          }
        } else {
          this.currentSession = null;
          this.otherParticipant = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setOtherParticipant(): void {
    if (!this.currentSession?.participants) {
      this.otherParticipant = null;
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.otherParticipant = null;
      return;
    }

    // Find the participant who is not the current user
    this.otherParticipant = this.currentSession.participants.find(
      (p) => p.user.id !== currentUser.id
    );
  }

  getParticipantName(): string {
    if (!this.otherParticipant) return 'Select a chat';
    return `${this.otherParticipant.user.firstName} ${this.otherParticipant.user.lastName}`;
  }

  getParticipantInitial(): string {
    if (!this.otherParticipant) return '?';
    return this.otherParticipant.user.firstName.charAt(0).toUpperCase();
  }

  getStatusText(): string {
    return this.isOnline ? 'Online' : 'Offline';
  }

  getStatusColor(): string {
    return this.isOnline ? 'text-green-600' : 'text-gray-500';
  }
}
