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
  firstName: string;
  lastName: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  isActive: boolean;
  unreadCount: number;
  hasAttachment: boolean;
  attachmentType: 'image' | 'file' | 'link';
  attachmentName: string;
  timestamp: string;
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
  firstName: string;
  lastName: string;
}

export interface ChatState {
  messages: Message[];
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  loading: boolean;
  error: string | null;
  typingUsers: string[];
}

export interface SendMessageRequest {
  message: string;
  chatSessionId: string;
  sender: string;
  receiver: string; // Added to support creating chat sessions on first message
}

export interface GetMessagesRequest {
  chatSessionId: string;
  page: number;
}

export interface MarkReadRequest {
  chatSessionId: string;
  userId: string;
}
