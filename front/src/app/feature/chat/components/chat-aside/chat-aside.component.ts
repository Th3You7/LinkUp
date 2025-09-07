import { Component, ViewEncapsulation } from '@angular/core';
import { ChatSessionCardComponent } from '../chat-session-card/chat-session-card.component';
import { CommonModule } from '@angular/common';

interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isVerified?: boolean;
  isOnline?: boolean;
  isActive?: boolean;
  unreadCount?: number;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'file' | 'link';
  attachmentName?: string;
}

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
export class ChatAsideComponent {
  selectedSessionId: string | null = null;

  chatSessions: ChatSession[] = [
    {
      id: 'hs-pro-tabs-chct-item-1',
      name: 'Costa Quinn',
      avatar:
        'https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
      lastMessage: 'Yes, you can!',
      timestamp: '1m',
      isVerified: true,
      isOnline: true,
      isActive: true,
    },
    {
      id: 'hs-pro-tabs-chct-item-2',
      name: 'Rachel Doe',
      avatar: '',
      lastMessage: '2. Using the static method causes an error in the console.',
      timestamp: '14m',
      unreadCount: 3,
      hasAttachment: true,
      attachmentType: 'image',
      attachmentName: 'img10.jpg',
    },
    {
      id: 'hs-pro-tabs-chct-item-3',
      name: 'Lewis Clarke',
      avatar:
        'https://images.unsplash.com/photo-1679412330254-90cb240038c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
      lastMessage: "How's these all free? 🤯",
      timestamp: '15m',
      hasAttachment: true,
      attachmentType: 'image',
      attachmentName: 'img9.webp',
    },
    {
      id: 'hs-pro-tabs-chct-item-4',
      name: 'Technical issues',
      avatar:
        'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80',
      lastMessage: 'Great! 👍️',
      timestamp: '55m',
      isVerified: true,
    },
    {
      id: 'hs-pro-tabs-chct-item-5',
      name: 'Bob Dean',
      avatar: '',
      lastMessage:
        "Hey Preline team, I got an error while using the headless UI component with preline. I'm not sure how to fix it. Could you kindly assist me in identifying what I might be missing? Your help would be greatly appreciate",
      timestamp: '41m',
      unreadCount: 1,
      hasAttachment: true,
      attachmentType: 'link',
    },
    {
      id: 'hs-pro-tabs-chct-item-6',
      name: 'Mark Colbert',
      avatar: '',
      lastMessage: 'Voice message',
      timestamp: '50m',
      isVerified: true,
      isOnline: true,
    },
    {
      id: 'hs-pro-tabs-chct-item-7',
      name: 'Ella Lauda',
      avatar:
        'https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
      lastMessage: 'site-source.zip',
      timestamp: '37m',
      unreadCount: 2,
      hasAttachment: true,
      attachmentType: 'file',
    },
    {
      id: 'hs-pro-tabs-chct-item-8',
      name: 'Bugs/Improvements',
      avatar:
        'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
      lastMessage:
        'I found a bug: Combobox selection of ahref items using keyboard #353',
      timestamp: '1h',
    },
    {
      id: 'hs-pro-tabs-chct-item-9',
      name: 'Alex Brown',
      avatar: '',
      lastMessage: 'I love Preline Pro! What can we expect in the next update?',
      timestamp: '2h',
    },
    {
      id: 'hs-pro-tabs-chct-item-10',
      name: 'David Harrison',
      avatar:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80',
      lastMessage: 'Thanks!',
      timestamp: '2h',
      unreadCount: 3,
    },
    {
      id: 'hs-pro-tabs-chct-item-11',
      name: 'Ols Schols',
      avatar: '',
      lastMessage: '',
      timestamp: '',
    },
  ];

  onSessionClick(sessionId: string): void {
    this.selectedSessionId = sessionId;
    // Update active state for all sessions
    this.chatSessions = this.chatSessions.map((session) => ({
      ...session,
      isActive: session.id === sessionId,
    }));
  }
}
