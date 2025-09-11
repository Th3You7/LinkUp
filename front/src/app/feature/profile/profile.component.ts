import { Component, signal, inject, OnInit } from '@angular/core';
import { ProfileMainComponent } from './components/profile-main/profile-main.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { CommonModule } from '@angular/common';
import { ProfileFriendsComponent } from './components/profile-friends/profile-friends.component';
import { NavabrComponent } from '../../shared/components/navabr/navabr.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    ProfileHeaderComponent,
    ProfileMainComponent,
    CommonModule,
    ProfileFriendsComponent,
    NavabrComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private currentTab = signal<string>('my-profile');
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  profileUserId: string | null = null;

  ngOnInit() {
    // Get the user ID from the route parameters
    this.route.params.subscribe((params) => {
      this.profileUserId = params['id'];
      if (this.profileUserId) {
        // Load the specific user's data
        this.userService.getUserById(this.profileUserId);
      }
    });
  }

  setCurrentTab(tab: string) {
    this.currentTab.set(tab);
  }

  getCurrentTab() {
    return this.currentTab();
  }

  getProfileUserId(): string | null {
    return this.profileUserId;
  }
}
