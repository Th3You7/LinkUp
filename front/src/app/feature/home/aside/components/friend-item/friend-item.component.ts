import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string | null;
}

@Component({
  selector: 'app-friend-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-item.component.html',
})
export class FriendItemComponent {
  @Input() friend!: Friend;

  getInitials(name: string): string {
    return name.charAt(0);
  }
}
