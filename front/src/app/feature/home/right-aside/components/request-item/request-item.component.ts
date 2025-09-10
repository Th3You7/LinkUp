import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendshipService } from '../../../../../core/services/friendship.service';
import { Friendship } from '../../../../../core/models/friendship.model';

@Component({
  selector: 'app-request-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-item.component.html',
})
export class RequestItemComponent {
  @Input() request!: Friendship;
  @Output() requestHandled = new EventEmitter<string>();

  private friendshipService = inject(FriendshipService);

  processing = false;

  getSenderName(): string {
    return `${this.request.sender.firstName} ${this.request.sender.lastName}`;
  }

  getSenderInitials(): string {
    return `${this.request.sender.firstName.charAt(
      0
    )}${this.request.sender.lastName.charAt(0)}`;
  }

  getTimeAgo(): string {
    const now = new Date();
    const requestTime = new Date(this.request.createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - requestTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  acceptRequest() {
    if (this.processing) return;

    this.processing = true;
    this.friendshipService
      .acceptFriendshipRequest(this.request.id, this.request.receiver.id)
      .subscribe({
        next: () => {
          this.requestHandled.emit(this.request.id);
          this.processing = false;
        },
        error: (error) => {
          console.error('Failed to accept friend request:', error);
          this.processing = false;
        },
      });
  }

  rejectRequest() {
    if (this.processing) return;

    this.processing = true;
    this.friendshipService
      .rejectFriendshipRequest(this.request.id, this.request.receiver.id)
      .subscribe({
        next: () => {
          this.requestHandled.emit(this.request.id);
          this.processing = false;
        },
        error: (error) => {
          console.error('Failed to reject friend request:', error);
          this.processing = false;
        },
      });
  }
}
