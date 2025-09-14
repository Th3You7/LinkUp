import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../core/models/chat.model';
import { AuthService } from '../../../../core/services/auth.service';

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
  private authService = inject(AuthService);

  @Input() message!: Message;

  @Output() editMessage = new EventEmitter<string>();
  @Output() replyMessage = new EventEmitter<string>();
  @Output() deleteMessage = new EventEmitter<string>();

  openDropdownId: string | null = null;

  get isOwnMessage(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.message.sender;
  }

  get formattedTime(): string {
    const date = new Date(this.message.createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

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
}
