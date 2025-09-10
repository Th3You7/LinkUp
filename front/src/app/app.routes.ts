import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./feature/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('./feature/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./feature/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'chat',
    pathMatch: 'full',
    loadComponent: () =>
      import('./feature/chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./feature/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
];
