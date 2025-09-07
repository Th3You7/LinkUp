import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-main-header',
  imports: [],
  templateUrl: './chat-main-header.component.html',
  styleUrl: './chat-main-header.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatMainHeaderComponent {}
