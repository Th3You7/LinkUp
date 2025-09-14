import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatSession } from '../../../../core/models/chat.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-chat-session-card',
  imports: [CommonModule],
  templateUrl: './chat-session-card.component.html',
  styleUrl: './chat-session-card.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatSessionCardComponent {
  private authService = inject(AuthService);

  @Input() chatSession: ChatSession | null = null;
  @Input() isActive: boolean = false;
  @Output() sessionClick = new EventEmitter<string>();

  get otherParticipant() {
    if (!this.chatSession?.participants) return null;
    const currentUser = this.authService.getCurrentUser();
    return this.chatSession.participants.find(
      (p) => p.user.id !== currentUser?.id
    );
  }

  get displayName() {
    const participant = this.otherParticipant;
    return participant
      ? `${participant.user.firstName} ${participant.user.lastName}`
      : 'Unknown User';
  }

  get lastMessageText() {
    return this.chatSession?.lastMessage?.message || 'No messages yet';
  }

  get lastMessageTime() {
    if (!this.chatSession?.lastMessage?.createdAt) return '';
    const date = new Date(this.chatSession.lastMessage.createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  }

  onClick(): void {
    if (this.chatSession?.id) {
      this.sessionClick.emit(this.chatSession.id);
    }
  }
}
