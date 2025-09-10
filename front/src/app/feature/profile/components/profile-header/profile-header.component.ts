import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { FriendshipService } from '../../../../core/services/friendship.service';
import { User } from '../../../../core/models/user.model';
import {
  FriendshipStatus,
  Friendship,
} from '../../../../core/models/friendship.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  @Input() currentTab: string = 'my-profile';
  @Input() profileUserId: string | null = null;
  @Output() currentTabChange = new EventEmitter<string>();
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private friendshipService = inject(FriendshipService);
  private router = inject(Router);
  currentUser: User | null = null;
  profileUser: User | null = null;
  friendshipStatus: FriendshipStatus | null = null;
  friendship: Friendship | null = null;
  isBlockDropdownOpen = false;

  ngOnInit(): void {
    // Always load current user first
    this.authService.user$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (this.profileUserId && this.currentUser) {
          this.loadFriendshipStatus();
        }
      },
      error: (error) => console.error(error),
    });

    if (this.profileUserId) {
      // Load specific user profile
      this.userService.state$.subscribe((state) => {
        this.profileUser = state.selectedUser;
        if (this.profileUser && this.currentUser) {
          this.loadFriendshipStatus();
        }
      });
    }
  }

  ngOnDestroy(): void {}

  getFullName(): string {
    const user = this.profileUser || this.currentUser;
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Loading...';
  }

  getUsername(): string {
    const user = this.profileUser || this.currentUser;
    if (user) {
      return user.username || 'No username';
    }
    return 'Loading...';
  }

  getUserAvatar(): string {
    const user = this.profileUser || this.currentUser;
    if (user) {
      return (
        user.avatar ||
        'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80'
      );
    }
    return 'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80';
  }

  isOwnProfile(): boolean {
    return this.profileUserId === this.currentUser?.id;
  }

  // Friendship management methods
  private loadFriendshipStatus() {
    if (!this.currentUser || !this.profileUserId) return;

    this.friendshipService
      .getFriendshipStatus(this.currentUser.id, this.profileUserId)
      .subscribe({
        next: (friendship) => {
          this.friendship = friendship;
          this.friendshipStatus = friendship?.status || null;
        },
        error: (error) => {
          console.error('Failed to load friendship status:', error);
        },
      });
  }

  isFriend(): boolean {
    return this.friendshipStatus === FriendshipStatus.ACCEPTED;
  }

  isBlocked(): boolean {
    return this.friendshipStatus === FriendshipStatus.BLOCKED;
  }

  isPending(): boolean {
    return this.friendshipStatus === FriendshipStatus.PENDING;
  }

  isPendingSender(): boolean {
    return (
      this.isPending() &&
      !!this.friendship &&
      !!this.currentUser &&
      this.friendship.sender.id === this.currentUser.id
    );
  }

  isPendingReceiver(): boolean {
    return (
      this.isPending() &&
      !!this.friendship &&
      !!this.currentUser &&
      this.friendship.receiver.id === this.currentUser.id
    );
  }

  addFriend() {
    if (!this.currentUser || !this.profileUser) return;

    this.friendshipService
      .sendFriendshipRequest(this.currentUser.id, {
        receiverEmail: this.profileUser.email,
      })
      .subscribe({
        next: () => {
          this.friendshipStatus = FriendshipStatus.PENDING;
          console.log('Friend request sent');
        },
        error: (error) => {
          console.error('Failed to send friend request:', error);
        },
      });
  }

  removeFriend() {
    if (!this.currentUser || !this.profileUserId) return;

    this.friendshipService
      .removeFriend(this.currentUser.id, this.profileUserId)
      .subscribe({
        next: () => {
          this.friendshipStatus = null;
          console.log('Friend removed');
        },
        error: (error) => {
          console.error('Failed to remove friend:', error);
        },
      });
  }

  cancelFriendRequest() {
    if (!this.currentUser || !this.friendship) return;

    this.friendshipService
      .cancelFriendshipRequest(this.friendship.id, this.currentUser.id)
      .subscribe({
        next: () => {
          this.friendshipStatus = null;
          this.friendship = null;
          console.log('Friend request cancelled');
        },
        error: (error) => {
          console.error('Failed to cancel friend request:', error);
        },
      });
  }

  acceptFriendRequest() {
    if (!this.currentUser || !this.friendship) return;

    this.friendshipService
      .acceptFriendshipRequest(this.friendship.id, this.currentUser.id)
      .subscribe({
        next: () => {
          this.friendshipStatus = FriendshipStatus.ACCEPTED;
          console.log('Friend request accepted');
        },
        error: (error) => {
          console.error('Failed to accept friend request:', error);
        },
      });
  }

  rejectFriendRequest() {
    if (!this.currentUser || !this.friendship) return;

    this.friendshipService
      .rejectFriendshipRequest(this.friendship.id, this.currentUser.id)
      .subscribe({
        next: () => {
          this.friendshipStatus = null;
          this.friendship = null;
          console.log('Friend request rejected');
        },
        error: (error) => {
          console.error('Failed to reject friend request:', error);
        },
      });
  }

  blockUser() {
    if (!this.currentUser || !this.profileUserId) return;

    this.friendshipService
      .blockUser(this.currentUser.id, this.profileUserId)
      .subscribe({
        next: () => {
          this.friendshipStatus = FriendshipStatus.BLOCKED;
          console.log('User blocked');
        },
        error: (error) => {
          console.error('Failed to block user:', error);
        },
      });
  }

  unblockUser() {
    if (!this.currentUser || !this.profileUserId) return;

    this.friendshipService
      .unblockUser(this.currentUser.id, this.profileUserId)
      .subscribe({
        next: () => {
          this.friendshipStatus = null;
          console.log('User unblocked');
        },
        error: (error) => {
          console.error('Failed to unblock user:', error);
        },
      });
  }

  startChat() {
    if (!this.profileUserId) return;
    this.router.navigate(['/chat'], {
      queryParams: { userId: this.profileUserId },
    });
  }

  toggleBlockDropdown() {
    this.isBlockDropdownOpen = !this.isBlockDropdownOpen;
  }

  closeBlockDropdown() {
    this.isBlockDropdownOpen = false;
  }

  onBlockUser() {
    this.blockUser();
    this.closeBlockDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.relative');

    // Close dropdown if clicking outside
    if (!dropdown && this.isBlockDropdownOpen) {
      this.closeBlockDropdown();
    }
  }
}
