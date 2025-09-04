export interface Message {
  id: string;
  message: string;
  sender: string;
  createdAt: string;
  chatSession: ChatSession;
}

export interface ChatSession {
  id: string;
  lastMessage?: Message;
  participants: ChatParticipant[];
}

export interface ChatParticipant {
  id: string;
  chatSession: ChatSession;
  user: User;
  joinedAt: string;
  lastReadAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface ChatState {
  messages: Message[];
  chatSessions: ChatSession[];
  currentSessionId?: string;
  loading: boolean;
  error: string | null;
  typingUsers: string[];
}

export interface SendMessageRequest {
  message: string;
  chatSessionId: string;
  sender: string;
}

export interface GetMessagesRequest {
  chatSessionId: string;
  page: number;
}

export interface MarkReadRequest {
  chatSessionId: string;
  userId: string;
}
