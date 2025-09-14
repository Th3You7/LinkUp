import { Component, ViewEncapsulation, Input } from '@angular/core';
import { ChatMainHeaderComponent } from '../chat-main-header/chat-main-header.component';
import { ChatMainContentComponent } from '../chat-main-content/chat-main-content.component';
import { ChatMainInputComponent } from '../chat-main-input/chat-main-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-main',
  imports: [
    ChatMainHeaderComponent,
    ChatMainContentComponent,
    ChatMainInputComponent,
    CommonModule,
  ],
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex-2 flex flex-col',
  },
})
export class ChatMainComponent {
  @Input() friendId: string | null = null;
}
