import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  hasReply?: boolean;
  replyTo?: {
    name: string;
    message: string;
  };
}

@Component({
  selector: 'app-chat-bubble',
  imports: [CommonModule],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatBubbleComponent {
  @Input() senderName: string = 'You';
  @Input() messages: Message[] = [
    {
      id: '1',
      content: 'Hello! How are you doing?',
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      content: "I'm doing great, thanks for asking!",
      timestamp: '2:31 PM',
    },
  ];
  @Input() avatar: string =
    'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80';

  @Output() editMessage = new EventEmitter<string>();
  @Output() replyMessage = new EventEmitter<string>();
  @Output() deleteMessage = new EventEmitter<string>();

  openDropdownId: string | null = null;

  handleEdit(messageId: string): void {
    this.editMessage.emit(messageId);
  }

  handleReply(messageId: string): void {
    this.replyMessage.emit(messageId);
  }

  handleDelete(messageId: string): void {
    this.deleteMessage.emit(messageId);
  }

  toggleDropdown(messageId: string): void {
    this.openDropdownId = this.openDropdownId === messageId ? null : messageId;
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }
}
