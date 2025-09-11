import {
  Component,
  OnInit,
  inject,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { filter, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navabr',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navabr.component.html',
  styleUrl: './navabr.component.css',
})
export class NavabrComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  isDropdownOpen = false;
  searchQuery = '';
  isSearchDropdownOpen = false;
  searchResults: User[] = [];
  showClearButton = false;
  isNotificationDropdownOpen = false;
  notifications: any[] = []; // TODO: Replace with proper Notification type
  currentRoute = '';
  isDarkTheme = false;
  isSearchLoading = false;

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.currentUser = user;
    });

    // Set initial route
    this.currentRoute = this.router.url;

    // Track current route for active styling
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });

    // Subscribe to search results
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.searchResults = users;
      });

    // Subscribe to search loading state
    this.userService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isSearchLoading = loading;
      });

    // Initialize notifications
    this.loadNotifications();

    // Initialize theme
    this.initializeTheme();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown-container');
    const searchContainer = target.closest('.search-container');
    const notificationContainer = target.closest('.notification-container');

    if (!dropdown) {
      this.isDropdownOpen = false;
    }

    if (!searchContainer) {
      this.isSearchDropdownOpen = false;
    }

    if (!notificationContainer) {
      this.isNotificationDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotificationDropdown() {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
  }

  loadNotifications() {
    // TODO: Implement actual notification API call
    // For now, simulate notifications
    this.notifications = [
      {
        id: 1,
        type: 'like',
        message: 'John Doe liked your post',
        time: '2 minutes ago',
        read: false,
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 2,
        type: 'comment',
        message: 'Jane Smith commented on your post',
        time: '15 minutes ago',
        read: false,
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        id: 3,
        type: 'friend_request',
        message: 'Mike Johnson sent you a friend request',
        time: '1 hour ago',
        read: true,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ];
  }

  markAsRead(notification: any) {
    notification.read = true;
    // TODO: Implement API call to mark notification as read
  }

  isActiveRoute(route: string): boolean {
    // Remove trailing slashes and query parameters for comparison
    const cleanCurrentRoute = this.currentRoute
      .split('?')[0]
      .replace(/\/$/, '');
    const cleanRoute = route.replace(/\/$/, '');

    // Special handling for profile routes
    if (route === '/profile') {
      // Check if current route is a user ID (like /4545-djkhf454...)
      // It should not be home, chat, login, register, and should be a single segment
      const isUserIdRoute =
        cleanCurrentRoute !== '/' &&
        cleanCurrentRoute !== '/chat' &&
        cleanCurrentRoute !== '/login' &&
        cleanCurrentRoute !== '/register' &&
        !cleanCurrentRoute.includes('/') &&
        cleanCurrentRoute.length > 1; // Ensure it's not just a single character
      return isUserIdRoute;
    }

    return cleanCurrentRoute === cleanRoute;
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  initializeTheme() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
    } else {
      // Check system preference
      this.isDarkTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput() {
    this.showClearButton = this.searchQuery.length > 0;

    if (this.searchQuery.trim().length > 0) {
      this.isSearchDropdownOpen = true;
      this.performSearch();
    } else {
      this.isSearchDropdownOpen = false;
      this.searchResults = [];
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.performSearch();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.showClearButton = false;
    this.isSearchDropdownOpen = false;
    this.searchResults = [];
  }

  private performSearch() {
    if (this.searchQuery.trim().length >= 2) {
      const currentUserId = this.currentUser?.id;
      this.userService.searchUsersByString(
        this.searchQuery.trim(),
        currentUserId
      );
    } else {
      this.searchResults = [];
    }
  }

  selectUser(user: User) {
    this.clearSearch();
    this.router.navigate(['/', user.id]);
  }

  getUserName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'User';
  }

  getUserEmail(): string {
    return this.currentUser?.email || 'user@example.com';
  }

  getUserAvatar(): string {
    return (
      this.currentUser?.avatar ||
      'https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80'
    );
  }
}
