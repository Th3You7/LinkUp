import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  inject,
  Input,
} from '@angular/core';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { ChatService } from '../../../../core/services/chat.service';
import { Message } from '../../../../core/models/chat.model';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-main-content',
  imports: [ChatBubbleComponent, CommonModule],
  templateUrl: './chat-main-content.component.html',
  styleUrl: './chat-main-content.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'flex-1 overflow-y-auto',
  },
})
export class ChatMainContentComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private destroy$ = new Subject<void>();
  @Input() friendId: string | null = null;
  messages: Message[] = [];
  currentSessionId: string | null = null;

  ngOnInit(): void {
    // Subscribe to messages
    this.chatService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages) => {
        this.messages = messages;
      });

    // Subscribe to current session
    this.chatService.chatState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.currentSessionId = state.currentSessionId || null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
