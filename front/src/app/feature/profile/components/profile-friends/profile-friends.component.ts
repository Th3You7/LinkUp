import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Friendship } from '../../../../core/models/friendship.model';
import { FriendshipService } from '../../../../core/services/friendship.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-friends',
  imports: [CommonModule],
  templateUrl: './profile-friends.component.html',
  styleUrl: './profile-friends.component.css',
})
export class ProfileFriendsComponent implements OnInit, OnDestroy {
  @Input() profileUserId: string | null = null;
  private friendshipService = inject(FriendshipService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  // State management
  private localFriendsSubject = new BehaviorSubject<Friendship[]>([]);
  private localLoadingSubject = new BehaviorSubject<boolean>(false);
  private localErrorSubject = new BehaviorSubject<string | null>(null);

  friends$: Observable<Friendship[]> = this.localFriendsSubject.asObservable();
  loading$: Observable<boolean> = this.localLoadingSubject.asObservable();
  error$: Observable<string | null> = this.localErrorSubject.asObservable();

  ngOnInit() {
    if (this.profileUserId) {
      this.loadFriends();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFriends() {
    if (!this.profileUserId) return;

    this.localLoadingSubject.next(true);
    this.localErrorSubject.next(null);

    this.friendshipService
      .getFriends(this.profileUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (friends) => {
          this.localFriendsSubject.next(friends || []);
          this.localLoadingSubject.next(false);
        },
        error: (error) => {
          console.error('Failed to load friends:', error);
          this.localErrorSubject.next('Failed to load friends');
          this.localLoadingSubject.next(false);
        },
      });
  }

  removeFriend(friendship: Friendship) {
    if (confirm('Are you sure you want to remove this friend?')) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const friendId =
        currentUser.id === friendship.sender.id
          ? friendship.receiver.id
          : friendship.sender.id;

      this.friendshipService
        .removeFriend(currentUser.id, friendId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Remove from local state
            const currentFriends = this.localFriendsSubject.value;
            const updatedFriends = currentFriends.filter(
              (f) => f.id !== friendship.id
            );
            this.localFriendsSubject.next(updatedFriends);
          },
          error: (error) => {
            console.error('Failed to remove friend:', error);
          },
        });
    }
  }

  getFriendName(friendship: Friendship): string {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return '';

    // Return the name of the friend (not the current user)
    return currentUser.id === friendship.sender.id
      ? `${friendship.receiver.firstName} ${friendship.receiver.lastName}`
      : `${friendship.sender.firstName} ${friendship.sender.lastName}`;
  }

  getFriendUsername(friendship: Friendship): string {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return '';

    // Return the username of the friend (not the current user)
    return currentUser.id === friendship.sender.id
      ? friendship.receiver.username
      : friendship.sender.username;
  }

  getFriendAvatar(friendship: Friendship): string {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return '';

    // Return the avatar of the friend (not the current user)
    return currentUser.id === friendship.sender.id
      ? friendship.receiver.avatar
      : friendship.sender.avatar;
  }
}
