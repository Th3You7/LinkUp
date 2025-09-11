import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FriendshipService } from '../../../core/services/friendship.service';
import { AuthService } from '../../../core/services/auth.service';
import { Friendship } from '../../../core/models/friendship.model';
import { RequestItemComponent } from './components/request-item/request-item.component';

@Component({
  selector: 'app-right-aside',
  standalone: true,
  imports: [CommonModule, RequestItemComponent],
  templateUrl: './right-aside.component.html',
  styleUrl: './right-aside.component.css',
})
export class RightAsideComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private friendshipService = inject(FriendshipService);
  private authService = inject(AuthService);

  friendRequests: Friendship[] = [];
  loading = false;
  error: string | null = null;
  currentUser: any = null;

  ngOnInit() {
    // Get current user
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadFriendRequests();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFriendRequests() {
    if (!this.currentUser) return;

    this.loading = true;
    this.error = null;

    this.friendshipService
      .getPendingRequests(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          // Filter requests where current user is the receiver
          this.friendRequests = (requests || []).filter(
            (request) => request.receiver.id === this.currentUser.id
          );
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load friend requests:', error);
          this.error = 'Failed to load friend requests';
          this.loading = false;
        },
      });
  }

  onRequestHandled(requestId: string) {
    // Remove the handled request from the list
    this.friendRequests = this.friendRequests.filter(
      (req) => req.id !== requestId
    );
  }

  trackByRequestId(index: number, request: Friendship): string {
    return request.id;
  }
}
