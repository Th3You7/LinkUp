import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  @Input() currentTab: string = 'my-profile';
  @Output() currentTabChange = new EventEmitter<string>();
  private authService = inject(AuthService);
  currentUser: User | null = null;

  getUser() {
    this.authService.user$.subscribe({
      next: (user) => (this.currentUser = user),
      error: (error) => console.error(error),
      complete: () => console.log('User fetched'),
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {}

  getFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return 'Loading...';
  }

  getUsername(): string {
    if (this.currentUser) {
      return this.currentUser.username || 'No username';
    }
    return 'Loading...';
  }
}
