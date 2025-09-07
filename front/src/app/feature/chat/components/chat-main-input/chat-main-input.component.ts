import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class ChatMainInputComponent {
  messageText: string = '';
  disabled: boolean = false;

  @Output() sendMessageEvent = new EventEmitter<string>();
  @Output() attachFileEvent = new EventEmitter<void>();
  @Output() addEmojiEvent = new EventEmitter<void>();
  @Output() voiceMessageEvent = new EventEmitter<void>();

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.sendMessageEvent.emit(this.messageText);
      this.messageText = '';
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
