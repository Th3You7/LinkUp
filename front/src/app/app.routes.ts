import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // Guest routes (login, register) - only accessible when not authenticated
  {
    path: 'login',
    pathMatch: 'full',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./feature/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./feature/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  // Protected routes - only accessible when authenticated
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./feature/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'chat',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./feature/chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./feature/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
];
