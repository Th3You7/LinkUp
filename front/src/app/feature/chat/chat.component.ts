import { Component, ViewEncapsulation } from '@angular/core';
import { ChatAsideComponent } from './components/chat-aside/chat-aside.component';
import { ChatMainComponent } from './components/chat-main/chat-main.component';

@Component({
  selector: 'app-chat',
  imports: [ChatAsideComponent, ChatMainComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex h-screen',
  },
})
export class ChatComponent {}
