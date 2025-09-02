import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendItemComponent } from './components/friend-item/friend-item.component';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string | null;
}

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, FriendItemComponent],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent {
  friendsData: Friend[] = [
    {
      id: 1,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: true,
      lastSeen: null,
    },
    {
      id: 2,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: true,
      lastSeen: null,
    },
    {
      id: 3,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: false,
      lastSeen: '11 min',
    },
    {
      id: 4,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: false,
      lastSeen: '11 min',
    },
    {
      id: 5,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: false,
      lastSeen: '11 min',
    },
    {
      id: 6,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: true,
      lastSeen: null,
    },
    {
      id: 7,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: true,
      lastSeen: null,
    },
    {
      id: 8,
      name: 'Uness B',
      avatar: '/male-avatar-16.png',
      isOnline: true,
      lastSeen: null,
    },
  ];

  trackByFriendId(index: number, friend: Friend): number {
    return friend.id;
  }
}
