import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  const currentToken = authService.getCurrentToken();

  // Check if user is authenticated (has both user and token)
  if (currentUser && currentToken) {
    return true;
  }

  // If not authenticated, redirect to login
  router.navigate(['/login']);
  return false;
};
