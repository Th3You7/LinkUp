import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';
import { AppConfig } from '../config/app.config';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  http = inject(HttpClient);

  constructor() {}

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      AppConfig.AUTH_ENDPOINTS.LOGIN,
      loginRequest
    );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      AppConfig.AUTH_ENDPOINTS.REGISTER,
      registerRequest
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
