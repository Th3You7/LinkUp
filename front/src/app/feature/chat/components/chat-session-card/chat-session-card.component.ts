import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChatSessionData {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVerified?: boolean;
  isOnline?: boolean;
  isActive?: boolean;
  unreadCount?: number;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'file' | 'link';
  attachmentName?: string;
}

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
  @Input() chatSession: ChatSessionData | null = null;
  @Input() isActive: boolean = false;
  @Output() sessionClick = new EventEmitter<string>();

  onClick(): void {
    if (this.chatSession?.id) {
      this.sessionClick.emit(this.chatSession.id);
    }
  }
}
