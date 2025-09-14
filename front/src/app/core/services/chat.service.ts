import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Client,
  Message as StompMessage,
  StompSubscription,
} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  Message,
  ChatSession,
  ChatState,
  SendMessageRequest,
  GetMessagesRequest,
  MarkReadRequest,
} from '../models/chat.model';
import { AppConfig } from '../config/app.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private currentUserId: string | null = null;
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private stompClient: Client | null = null;
  private currentSessionSubscription: StompSubscription | null = null;
  private isConnected = false;

  // State management
  private chatState = new BehaviorSubject<ChatState>({
    messages: [],
    chatSessions: [],
    currentSessionId: null,
    loading: false,
    error: null,
    typingUsers: [],
  });

  // Public observables
  public chatState$ = this.chatState.asObservable();
  public messages$ = this.chatState$.pipe(map((state) => state.messages));
  public chatSessions$ = this.chatState$.pipe(
    map((state) => state.chatSessions)
  );
  public loading$ = this.chatState$.pipe(map((state) => state.loading));
  public error$ = this.chatState$.pipe(map((state) => state.error));
  public typingUsers$ = this.chatState$.pipe(map((state) => state.typingUsers));
  public currentSessionId$ = this.chatState$.pipe(
    map((state) => state.currentSessionId)
  );

  constructor() {
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    this.initializeWebSocketConnection();
  }

  /**
   * Initialize WebSocket connection using STOMP over SockJS
   */
  private initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 3000,
      heartbeatIncoming: 2000,
      heartbeatOutgoing: 2000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      this.isConnected = true;
      console.log(this.currentUserId);
      if (this.currentUserId) {
        this.subscribeToChatSessions(this.currentUserId);
      }
      this.chatState.next({
        ...this.chatState.value,
        error: null,
      });
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('Disconnected from WebSocket:', frame);
      this.isConnected = false;
      this.currentSessionSubscription?.unsubscribe();
      this.currentSessionSubscription = null;
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      this.chatState.next({
        ...this.chatState.value,
        error: 'WebSocket connection error',
      });
    };

    this.stompClient.activate();
  }

  public subscribeToChatSessions(currentUserId: string): void {
    console.log('Subscribing to chat sessions for user:', currentUserId);
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    // Best Practice 1: Load initial data via WebSocket

    // Best Practice 2: Subscribe to real-time updates
    this.stompClient.subscribe(
      `/topic/sessions/${currentUserId}`,
      (message: StompMessage) => {
        const receivedChatSessions: ChatSession[] = JSON.parse(message.body);
        console.log('Real-time update:', receivedChatSessions);
        this.updateChatSessions(receivedChatSessions);
      }
    );

    // Best Practice 3: Subscribe to user-specific queue for initial data
    this.stompClient.subscribe(
      `/user/queue/sessions`,
      (message: StompMessage) => {
        const receivedChatSessions: ChatSession[] = JSON.parse(message.body);
        console.log('Initial load:', receivedChatSessions);
        this.updateChatSessions(receivedChatSessions);
      }
    );

    this.loadInitialChatSessions(currentUserId);
  }

  /**
   * Load initial chat sessions via WebSocket
   * Best Practice: Use WebSocket for all real-time communication
   */
  private loadInitialChatSessions(userId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected for initial load');
      return;
    }

    console.log('Requesting initial chat sessions for user:', userId);
    this.stompClient.publish({
      destination: '/app/chat.load_sessions',
      body: userId,
    });
  }

  /**
   * Update chat sessions in state
   * Best Practice: Centralized state update logic
   */
  private updateChatSessions(chatSessions: ChatSession[]): void {
    const currentState = this.chatState.value;
    const newCurrentSessionId =
      chatSessions.length > 0 ? chatSessions[0].id : null;

    this.chatState.next({
      ...currentState,
      chatSessions: chatSessions,
      currentSessionId: newCurrentSessionId,
    });

    this.stompClient?.subscribe(
      `/topic/sessions/${newCurrentSessionId}/messages`,
      (message: StompMessage) => {
        const receivedMessages: Message[] = JSON.parse(message.body);
        this.chatState.next({
          ...this.chatState.value,
          messages: receivedMessages,
        });
      }
    );

    // If we have a new current session and it's different from the previous one,
    // load initial messages and subscribe to updates
    if (
      newCurrentSessionId &&
      newCurrentSessionId !== currentState.currentSessionId
    ) {
      this.subscribeToCurrentSessionMessages(newCurrentSessionId);
      this.loadInitialMessages(newCurrentSessionId);
    }
  }

  public subscribeToCurrentSessionMessages(currentSessionId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    // check if the subscription already opened for the current session
    if (this.chatState.value.currentSessionId === currentSessionId) {
      return;
    }

    // unsubscribe from the previous subscription
    if (this.currentSessionSubscription) {
      this.currentSessionSubscription.unsubscribe();
      this.currentSessionSubscription = null;
    }

    // subscribe to the current session messages
    this.currentSessionSubscription = this.stompClient.subscribe(
      `/topic/sessions/${currentSessionId}/messages`,
      (message: StompMessage) => {
        const receivedMessages: Message[] = JSON.parse(message.body);
        this.chatState.next({
          ...this.chatState.value,
          currentSessionId: currentSessionId,
          messages: receivedMessages,
        });
      }
    );
  }

  /**
   * Send a message
   */
  public sendMessage(request: SendMessageRequest): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      message: request.message,
      sender: request.sender,
      chatSessionId: request.chatSessionId,
      receiver: request.receiver,
    };

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  /**
   * Delete a message
   */
  public deleteMessage(messageId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.delete_message',
      body: messageId,
    });
  }

  /**
   * Delete a chat session
   */
  public deleteChatSession(sessionId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.delete_session',
      body: sessionId,
    });
  }

  /**
   * Load initial messages for a chat session
   */
  public loadInitialMessages(sessionId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    console.log('Loading initial messages for session:', sessionId);
    this.stompClient.publish({
      destination: '/app/chat.load_messages',
      body: JSON.stringify({ chatSessionId: sessionId, page: 0 }),
    });
  }

  /**
   * Set current chat session and load initial messages
   */
  public setCurrentSession(sessionId: string): void {
    this.chatState.next({
      ...this.chatState.value,
      currentSessionId: sessionId,
    });

    // Subscribe to typing events for this session
    if (this.isConnected && this.stompClient) {
      this.stompClient.subscribe(
        `/topic/sessions/${sessionId}/typing`,
        (message: StompMessage) => {
          // Handle typing indicator
          console.log('Typing event received:', message.body);
        }
      );
    }
  }

  /**
   * Get connection status
   */
  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    if (this.stompClient) {
      this.currentSessionSubscription?.unsubscribe();
      this.currentSessionSubscription = null;
      this.stompClient.deactivate();
    }
  }

  /**
   * Create a new chat session between two users
   */
  public createChatSession(
    userId1: string,
    userId2: string
  ): Observable<ChatSession> {
    return this.http.post<ChatSession>(
      `${AppConfig.API_BASE_URL}/chat/create-session`,
      null,
      {
        params: { userId1, userId2 },
      }
    );
  }

  /**
   * Get the receiver ID from the current chat session
   */
  public getReceiverFromCurrentSession(): string | null {
    const currentState = this.chatState.value;
    const currentSessionId = currentState.currentSessionId;

    if (!currentSessionId) {
      return null;
    }

    // Find the current session
    const currentSession = currentState.chatSessions.find(
      (session) => session.id === currentSessionId
    );

    if (!currentSession || !currentSession.participants) {
      return null;
    }

    // Find the participant who is not the current user
    const receiver = currentSession.participants.find(
      (participant) => participant.user.id !== this.currentUserId
    );

    return receiver ? receiver.user.id : null;
  }

  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.disconnect();
  }
}
