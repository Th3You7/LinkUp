import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AppConfig } from '../config/app.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip interceptor for authentication routes
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = localStorage.getItem(AppConfig.STORAGE_KEYS.TOKEN);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Unauthorized - token is invalid or expired
        authService.logout();
      } else if (error.status === 403) {
        // Forbidden - user doesn't have permission for this resource
        // Don't logout immediately, just return the error
        console.warn('Access forbidden - insufficient permissions');
      }
      return throwError(() => error);
    })
  );
};
