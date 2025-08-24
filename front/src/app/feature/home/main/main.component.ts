import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';

interface NavigationItem {
  icon: string;
  isActive: boolean;
}

interface AvatarUser {
  src: string;
  alt: string;
}

interface Post {
  user: {
    name: string;
    avatar: string;
    timestamp: string;
  };
  likes: string;
  comments: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, PostCardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  navigationItems: NavigationItem[] = [
    { icon: 'home', isActive: true },
    { icon: 'user', isActive: false },
    { icon: 'message-circle', isActive: false },
    { icon: 'bot', isActive: false },
    { icon: 'settings', isActive: false },
  ];

  avatarUsers: AvatarUser[] = [
    { src: '/male-avatar-16.png', alt: 'Male avatar' },
    { src: '/male-avatar-16.png', alt: 'Male avatar' },
    { src: '/male-avatar-16.png', alt: 'Male avatar' },
    { src: '/male-avatar-16.png', alt: 'Male avatar' },
    { src: '/male-avatar-16.png', alt: 'Male avatar' },
  ];

  posts: Post[] = [
    {
      user: {
        name: 'Uness B',
        avatar: '/male-avatar-16.png',
        timestamp: 'April 22 at 23:00',
      },
      likes: 'You and 550',
      comments: '330',
    },
    {
      user: {
        name: 'Uness B',
        avatar: '/male-avatar-16.png',
        timestamp: 'April 22 at 23:00',
      },
      likes: 'You and 550',
      comments: '330',
    },
    {
      user: {
        name: 'Uness B',
        avatar: '/male-avatar-16.png',
        timestamp: 'April 22 at 23:00',
      },
      likes: 'You and 550',
      comments: '330',
    },
  ];

  getIconClass(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'message-circle':
        'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      bot: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      settings:
        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    };
    return iconMap[iconName] || '';
  }

  setActiveNavigation(index: number): void {
    this.navigationItems.forEach((item, i) => {
      item.isActive = i === index;
    });
  }
}
