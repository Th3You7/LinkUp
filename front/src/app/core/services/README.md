# Chat WebSocket Service

This document describes the WebSocket-based chat service implementation for the LinkUp application.

## Overview

The `ChatService` provides real-time chat functionality using STOMP (Simple Text Oriented Messaging Protocol) over WebSocket connections. It handles message sending/receiving, typing indicators, read receipts, and connection management.

## Features

- ✅ Real-time message sending and receiving
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Message deletion
- ✅ Chat session management
- ✅ Automatic reconnection
- ✅ Connection status monitoring
- ✅ State management with RxJS observables

## Dependencies

The service requires the following packages (already installed):

```bash
npm install @stomp/stompjs sockjs-client @types/sockjs-client
```

## Usage

### 1. Basic Setup

The service is automatically initialized when injected. It connects to the WebSocket endpoint at `ws://localhost:8080/ws`.

```typescript
import { ChatService } from './core/services/chat.service';

@Component({...})
export class MyComponent {
  constructor(private chatService: ChatService) {}
}
```

### 2. Subscribe to Messages

Subscribe to messages for a specific user:

```typescript
ngOnInit() {
  // Subscribe to messages for the current user
  this.chatService.subscribeToMessages('user123');

  // Subscribe to typing indicators for a chat session
  this.chatService.subscribeToTyping('session456');
}
```

### 3. Send Messages

```typescript
sendMessage(text: string) {
  const request: SendMessageRequest = {
    message: text,
    chatSessionId: 'session456',
    sender: 'user123'
  };

  this.chatService.sendMessage(request);
}
```

### 4. Monitor State

```typescript
ngOnInit() {
  // Subscribe to connection status
  this.chatService.connectionStatus$.subscribe(
    connected => console.log('Connected:', connected)
  );

  // Subscribe to messages
  this.chatService.messages$.subscribe(
    messages => console.log('Messages:', messages)
  );

  // Subscribe to typing indicators
  this.chatService.typingUsers$.subscribe(
    typingUsers => console.log('Typing users:', typingUsers)
  );
}
```

## API Reference

### Properties

| Property            | Type                         | Description              |
| ------------------- | ---------------------------- | ------------------------ |
| `connectionStatus$` | `Observable<boolean>`        | Connection status stream |
| `messages$`         | `Observable<Message[]>`      | Messages stream          |
| `chatSessions$`     | `Observable<ChatSession[]>`  | Chat sessions stream     |
| `loading$`          | `Observable<boolean>`        | Loading state stream     |
| `error$`            | `Observable<string \| null>` | Error state stream       |
| `typingUsers$`      | `Observable<string[]>`       | Typing users stream      |

### Methods

#### Connection Management

```typescript
// Check if WebSocket is connected
isWebSocketConnected(): boolean

// Disconnect from WebSocket
disconnect(): void
```

#### Message Operations

```typescript
// Send a message
sendMessage(request: SendMessageRequest): void

// Get messages for a chat session
getMessages(request: GetMessagesRequest): void

// Mark messages as read
markAsRead(request: MarkReadRequest): void

// Delete a message
deleteMessage(messageId: string): void
```

#### Subscription Management

```typescript
// Subscribe to messages for a user
subscribeToMessages(userId: string): void

// Subscribe to typing indicators
subscribeToTyping(chatSessionId: string): void
```

#### Session Management

```typescript
// Set current chat session
setCurrentSession(sessionId: string): void

// Delete a chat session
deleteChatSession(sessionId: string): void

// Clear messages for a session
clearMessages(sessionId: string): void
```

#### Typing Indicators

```typescript
// Send typing indicator
sendTypingIndicator(chatSessionId: string): void
```

## Data Models

### Message Interface

```typescript
interface Message {
  id: string;
  message: string;
  sender: string;
  createdAt: string;
  chatSession: ChatSession;
}
```

### ChatSession Interface

```typescript
interface ChatSession {
  id: string;
  lastMessage?: Message;
  participants: ChatParticipant[];
}
```

### Request Interfaces

```typescript
interface SendMessageRequest {
  message: string;
  chatSessionId: string;
  sender: string;
}

interface GetMessagesRequest {
  chatSessionId: string;
  page: number;
}

interface MarkReadRequest {
  chatSessionId: string;
  userId: string;
}
```

## Server Integration

The service is designed to work with the Spring Boot WebSocket server that provides the following endpoints:

- **WebSocket Endpoint**: `/ws` (SockJS)
- **Message Broker**: `/topic` (subscriptions), `/app` (sending)
- **Message Destinations**:
  - `/app/chat.send` - Send message
  - `/app/chat.list` - Get messages
  - `/app/chat.read` - Mark as read
  - `/app/chat.delete_message` - Delete message
  - `/app/chat.delete_session` - Delete session
  - `/app/chat.typing` - Typing indicator

## Error Handling

The service includes comprehensive error handling:

- Connection errors are logged and reflected in the error state
- Automatic reconnection with 5-second delay
- Graceful degradation when WebSocket is unavailable
- Error state management through observables

## Best Practices

1. **Always check connection status** before sending messages
2. **Unsubscribe from observables** in `ngOnDestroy()`
3. **Handle loading states** for better UX
4. **Use typing indicators** sparingly to avoid spam
5. **Implement proper error handling** for production use

## Example Component

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChatService } from "./core/services/chat.service";
import { Message, SendMessageRequest } from "./core/models/chat.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-chat",
  template: `
    <div class="chat-container">
      <div class="status">
        {{ (connectionStatus$ | async) ? "Connected" : "Disconnected" }}
      </div>

      <div class="messages">
        <div *ngFor="let message of messages" class="message">
          <strong>{{ message.sender }}:</strong> {{ message.message }}
        </div>
      </div>

      <div class="input-area">
        <input [(ngModel)]="newMessage" (keyup.enter)="send()" placeholder="Type message..." />
        <button (click)="send()">Send</button>
      </div>
    </div>
  `,
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = "";
  connectionStatus$ = this.chatService.connectionStatus$;
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Subscribe to messages
    this.subscriptions.push(this.chatService.messages$.subscribe((messages) => (this.messages = messages)));

    // Subscribe to messages for this user
    this.chatService.subscribeToMessages("user123");
  }

  send() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage({
        message: this.newMessage,
        chatSessionId: "session456",
        sender: "user123",
      });
      this.newMessage = "";
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection fails**: Check if the server is running on `localhost:8080`
2. **Messages not received**: Verify user ID and session ID are correct
3. **Typing indicators not working**: Ensure proper subscription to typing topics
4. **Memory leaks**: Always unsubscribe from observables

### Debug Mode

The service includes debug logging. Check browser console for STOMP debug messages to troubleshoot connection issues.
