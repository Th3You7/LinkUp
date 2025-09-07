import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  private stompClient: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private isConnected = false;

  // State management
  private chatState = new BehaviorSubject<ChatState>({
    messages: [],
    chatSessions: [],
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

  // Connection status
  public connectionStatus$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeWebSocketConnection();
  }

  /**
   * Initialize WebSocket connection using STOMP over SockJS
   */
  private initializeWebSocketConnection(): void {
    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${AppConfig.API_BASE_URL.replace('/api', '')}/ws`),
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
      this.connectionStatus$.next(true);
      this.chatState.next({
        ...this.chatState.value,
        error: null,
      });
    };

    this.stompClient.onDisconnect = (frame) => {
      console.log('Disconnected from WebSocket:', frame);
      this.isConnected = false;
      this.connectionStatus$.next(false);
      this.subscriptions.clear();
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

  /**
   * Subscribe to messages for a specific user
   */
  public subscribeToMessages(userId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe(
      `/topic/messages/${userId}`,
      (message: StompMessage) => {
        const receivedMessage: Message = JSON.parse(message.body);
        this.addMessage(receivedMessage);
      }
    );

    this.subscriptions.set(`messages_${userId}`, subscription);
  }

  /**
   * Subscribe to typing indicators for a chat session
   */
  public subscribeToTyping(chatSessionId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    const subscription = this.stompClient.subscribe(
      `/topic/typing/${chatSessionId}`,
      (message: StompMessage) => {
        const isTyping = JSON.parse(message.body);
        if (isTyping) {
          this.addTypingUser(chatSessionId);
        } else {
          this.removeTypingUser(chatSessionId);
        }
      }
    );

    this.subscriptions.set(`typing_${chatSessionId}`, subscription);
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
      chatSession: { id: request.chatSessionId },
    };

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  /**
   * Get messages for a chat session
   */
  public getMessages(request: GetMessagesRequest): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    this.chatState.next({
      ...this.chatState.value,
      loading: true,
    });

    this.stompClient.publish({
      destination: '/app/chat.list',
      body: JSON.stringify({
        chatSessionId: request.chatSessionId,
        page: request.page,
      }),
    });
  }

  /**
   * Mark messages as read
   */
  public markAsRead(request: MarkReadRequest): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      chatSession: { id: request.chatSessionId },
      sender: request.userId,
    };

    this.stompClient.publish({
      destination: '/app/chat.read',
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
   * Send typing indicator
   */
  public sendTypingIndicator(chatSessionId: string): void {
    if (!this.isConnected || !this.stompClient) {
      console.error('WebSocket not connected');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.typing',
      body: chatSessionId,
    });
  }

  /**
   * Add a message to the state
   */
  private addMessage(message: Message): void {
    const currentState = this.chatState.value;
    const updatedMessages = [...currentState.messages, message];

    this.chatState.next({
      ...currentState,
      messages: updatedMessages,
    });
  }

  /**
   * Add typing user to the state
   */
  private addTypingUser(chatSessionId: string): void {
    const currentState = this.chatState.value;
    if (!currentState.typingUsers.includes(chatSessionId)) {
      this.chatState.next({
        ...currentState,
        typingUsers: [...currentState.typingUsers, chatSessionId],
      });
    }
  }

  /**
   * Remove typing user from the state
   */
  private removeTypingUser(chatSessionId: string): void {
    const currentState = this.chatState.value;
    this.chatState.next({
      ...currentState,
      typingUsers: currentState.typingUsers.filter(
        (id) => id !== chatSessionId
      ),
    });
  }

  /**
   * Set current chat session
   */
  public setCurrentSession(sessionId: string): void {
    this.chatState.next({
      ...this.chatState.value,
      currentSessionId: sessionId,
    });
  }

  /**
   * Clear messages for a specific session
   */
  public clearMessages(sessionId: string): void {
    const currentState = this.chatState.value;
    this.chatState.next({
      ...currentState,
      messages: currentState.messages.filter(
        (msg) => msg.chatSession.id !== sessionId
      ),
    });
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
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions.clear();
      this.stompClient.deactivate();
    }
  }

  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.disconnect();
  }
}
