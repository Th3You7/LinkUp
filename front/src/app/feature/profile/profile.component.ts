import { Component, signal } from '@angular/core';
import { ProfileMainComponent } from './components/profile-main/profile-main.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { CommonModule } from '@angular/common';
import { ProfileFriendsComponent } from './components/profile-friends/profile-friends.component';
import { NavabrComponent } from '../../shared/components/navabr/navabr.component';

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
export class ProfileComponent {
  private currentTab = signal<string>('my-profile');

  setCurrentTab(tab: string) {
    this.currentTab.set(tab);
  }

  getCurrentTab() {
    return this.currentTab();
  }
}
