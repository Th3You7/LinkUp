import { Component, ViewEncapsulation } from '@angular/core';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';

@Component({
  selector: 'app-chat-main-content',
  imports: [ChatBubbleComponent],
  templateUrl: './chat-main-content.component.html',
  styleUrl: './chat-main-content.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex-1 overflow-y-auto',
  },
})
export class ChatMainContentComponent {}
