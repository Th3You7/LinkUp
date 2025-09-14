import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { ChatSessionCardComponent } from '../chat-session-card/chat-session-card.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../../../core/services/chat.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatSession } from '../../../../core/models/chat.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-aside',
  imports: [ChatSessionCardComponent, CommonModule],
  templateUrl: './chat-aside.component.html',
  styleUrl: './chat-aside.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class ChatAsideComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  selectedSessionId: string | null = null;
  chatSessions: ChatSession[] = [];

  ngOnInit(): void {
    // Subscribe to chat sessions
    this.chatService.chatSessions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sessions) => {
        this.chatSessions = sessions;
      });

    // Load chat sessions for current user
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSessionClick(sessionId: string): void {
    this.selectedSessionId = sessionId;
    this.chatService.setCurrentSession(sessionId);

    // Subscribe to messages for this session
    this.chatService.subscribeToCurrentSessionMessages(sessionId);

    // Load initial messages for this session
    this.chatService.loadInitialMessages(sessionId);
  }
}
