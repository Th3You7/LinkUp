import { Component, ViewEncapsulation } from '@angular/core';
import { ChatMainHeaderComponent } from '../chat-main-header/chat-main-header.component';
import { ChatMainContentComponent } from '../chat-main-content/chat-main-content.component';
import { ChatMainInputComponent } from '../chat-main-input/chat-main-input.component';

@Component({
  selector: 'app-chat-main',
  imports: [
    ChatMainHeaderComponent,
    ChatMainContentComponent,
    ChatMainInputComponent,
  ],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex-2 flex flex-col',
  },
})
export class ChatMainComponent {}
