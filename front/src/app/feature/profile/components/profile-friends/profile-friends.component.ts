import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { Friendship } from '../../../../core/models/friendship.model';
import { FriendshipService } from '../../../../core/services/friendship.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-friends',
  imports: [CommonModule],
  templateUrl: './profile-friends.component.html',
  styleUrl: './profile-friends.component.css',
})
export class ProfileFriendsComponent implements OnInit {
  private friendshipService = inject(FriendshipService);
  private authService = inject(AuthService);

  // Local state for testing
  private localFriendsSubject = new BehaviorSubject<Friendship[]>([]);
  private localLoadingSubject = new BehaviorSubject<boolean>(false);
  private localErrorSubject = new BehaviorSubject<string | null>(null);

  friends$: Observable<Friendship[]> = this.localFriendsSubject.asObservable();
  loading$: Observable<boolean> = this.localLoadingSubject.asObservable();
  error$: Observable<string | null> = this.localErrorSubject.asObservable();

  ngOnInit() {
    // Load friends when component initializes
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.friendshipService.getFriends(currentUser.id).subscribe();
    }

    // Add static friends for testing
    this.addStaticFriends();
  }

  private addStaticFriends() {
    // Mock friends data for testing the design
    const mockFriends: Friendship[] = [
      {
        id: '1',
        sender: {
          id: 'current-user',
          username: 'current_user',
          email: 'current@example.com',
          firstName: 'Current',
          lastName: 'User',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        receiver: {
          id: 'friend-1',
          username: 'john_doe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'ACCEPTED' as any,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        sender: {
          id: 'friend-2',
          username: 'jane_smith',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          avatar:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        receiver: {
          id: 'current-user',
          username: 'current_user',
          email: 'current@example.com',
          firstName: 'Current',
          lastName: 'User',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'ACCEPTED' as any,
        createdAt: '2024-01-20T14:15:00Z',
        updatedAt: '2024-01-20T14:15:00Z',
      },
      {
        id: '3',
        sender: {
          id: 'current-user',
          username: 'current_user',
          email: 'current@example.com',
          firstName: 'Current',
          lastName: 'User',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        receiver: {
          id: 'friend-3',
          username: 'alex_wilson',
          email: 'alex@example.com',
          firstName: 'Alex',
          lastName: 'Wilson',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'ACCEPTED' as any,
        createdAt: '2024-02-01T09:45:00Z',
        updatedAt: '2024-02-01T09:45:00Z',
      },
      {
        id: '4',
        sender: {
          id: 'friend-4',
          username: 'sarah_johnson',
          email: 'sarah@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          avatar:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        receiver: {
          id: 'current-user',
          username: 'current_user',
          email: 'current@example.com',
          firstName: 'Current',
          lastName: 'User',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'ACCEPTED' as any,
        createdAt: '2024-02-10T16:20:00Z',
        updatedAt: '2024-02-10T16:20:00Z',
      },
      {
        id: '5',
        sender: {
          id: 'current-user',
          username: 'current_user',
          email: 'current@example.com',
          firstName: 'Current',
          lastName: 'User',
          avatar: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        receiver: {
          id: 'friend-5',
          username: 'mike_brown',
          email: 'mike@example.com',
          firstName: 'Mike',
          lastName: 'Brown',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        status: 'ACCEPTED' as any,
        createdAt: '2024-02-15T11:30:00Z',
        updatedAt: '2024-02-15T11:30:00Z',
      },
    ];

    // Update local state with mock data
    this.localFriendsSubject.next(mockFriends);
    this.localLoadingSubject.next(false);
    this.localErrorSubject.next(null);
  }

  removeFriend(friendship: Friendship) {
    if (confirm('Are you sure you want to remove this friend?')) {
      // Remove from local state for testing
      const currentFriends = this.localFriendsSubject.value;
      const updatedFriends = currentFriends.filter(
        (f) => f.id !== friendship.id
      );
      this.localFriendsSubject.next(updatedFriends);

      // In real implementation, you would call the service:
      // const currentUser = this.authService.getCurrentUser();
      // if (!currentUser) return;
      // const friendId = currentUser.id === friendship.sender.id
      //   ? friendship.receiver.id
      //   : friendship.sender.id;
      // this.friendshipService.removeFriend(currentUser.id, friendId).subscribe();
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
