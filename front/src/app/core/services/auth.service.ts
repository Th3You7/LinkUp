import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';
import { AppConfig } from '../config/app.config';
import { User } from '../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  http = inject(HttpClient);
  private state = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  state$ = this.state.asObservable();
  user$ = this.state$.pipe(map((state: AuthState) => state.user));
  token$ = this.state$.pipe(map((state: AuthState) => state.token));
  loading$ = this.state$.pipe(map((state: AuthState) => state.loading));
  error$ = this.state$.pipe(map((state: AuthState) => state.error));

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    // Try to restore user and token from localStorage
    const storedToken = localStorage.getItem(AppConfig.STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(AppConfig.STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.setUser(user);
        this.setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem(AppConfig.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AppConfig.STORAGE_KEYS.USER);
      }
    }
  }

  setUser(user: User | null) {
    this.state.next({ ...this.state.value, user });
  }

  setToken(token: string | null) {
    this.state.next({ ...this.state.value, token });
  }

  setLoading(loading: boolean) {
    this.state.next({ ...this.state.value, loading });
  }

  setError(error: string | null) {
    this.state.next({ ...this.state.value, error });
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    return this.http
      .post<AuthResponse>(AppConfig.AUTH_ENDPOINTS.LOGIN, loginRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.setUser(response.user as User);
          this.setToken(response.token);
          // Store in localStorage for persistence
          localStorage.setItem(AppConfig.STORAGE_KEYS.TOKEN, response.token);
          localStorage.setItem(
            AppConfig.STORAGE_KEYS.USER,
            JSON.stringify(response.user)
          );
        }),
        finalize(() => {
          this.setLoading(false);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    this.setLoading(true);
    return this.http
      .post<AuthResponse>(AppConfig.AUTH_ENDPOINTS.REGISTER, registerRequest)
      .pipe(
        tap((response: AuthResponse) => {
          this.setUser(response.user as User);
          this.setToken(response.token);
          // Store in localStorage for persistence
          localStorage.setItem(AppConfig.STORAGE_KEYS.TOKEN, response.token);
          localStorage.setItem(
            AppConfig.STORAGE_KEYS.USER,
            JSON.stringify(response.user)
          );
        }),
        finalize(() => {
          this.setLoading(false);
        })
      );
  }

  logout() {
    localStorage.removeItem(AppConfig.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AppConfig.STORAGE_KEYS.USER);
    this.setUser(null);
    this.setToken(null);
    this.setLoading(false);
    this.setError(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.state.value.user;
  }

  getCurrentToken(): string | null {
    return this.state.value.token;
  }
}
