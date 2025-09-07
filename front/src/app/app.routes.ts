import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./feature/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./feature/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./feature/chat/chat.component').then((m) => m.ChatComponent),
  },
];
