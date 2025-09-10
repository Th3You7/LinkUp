import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  const currentToken = authService.getCurrentToken();

  // Check if user is authenticated (has both user and token)
  if (currentUser && currentToken) {
    // If authenticated, redirect to home
    router.navigate(['/']);
    return false;
  }

  // If not authenticated, allow access to guest routes
  return true;
};
