import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { User } from '../models/user.model';
import { AppConfig } from '../config/app.config';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private userState = new BehaviorSubject<UserState>({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  });

  state$ = this.userState.asObservable();
  users$ = this.state$.pipe(map((state: UserState) => state.users));
  selectedUser$ = this.state$.pipe(
    map((state: UserState) => state.selectedUser)
  );
  loading$ = this.state$.pipe(map((state: UserState) => state.loading));
  error$ = this.state$.pipe(map((state: UserState) => state.error));

  searchUsersByString(str: string, currentUserId?: string): void {
    this.userState.next({
      ...this.userState.value,
      loading: true,
      error: null,
    });
    this.http
      .get<User[]>(`${AppConfig.API_BASE_URL}/users/search?searchTerm=${str}`)
      .pipe(
        map((users: User[]) => {
          // Exclude current user from search results
          const filteredUsers = currentUserId
            ? users.filter((user) => user.id !== currentUserId)
            : users;

          this.userState.next({
            ...this.userState.value,
            users: filteredUsers,
            error: null,
          });
        }),
        finalize(() => {
          this.userState.next({
            ...this.userState.value,
            loading: false,
          });
        }),
        catchError((error: any) => {
          this.userState.next({
            ...this.userState.value,
            error: 'Failed to search users',
            loading: false,
          });
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  searchUsersByUsername(username: string): void {
    this.userState.next({
      ...this.userState.value,
      loading: true,
      error: null,
    });
    this.http
      .get<User[]>(
        `${AppConfig.API_BASE_URL}/users/search/username?username=${username}`
      )
      .pipe(
        map((users: User[]) => {
          this.userState.next({
            ...this.userState.value,
            users: users,
            error: null,
          });
        }),
        finalize(() => {
          this.userState.next({
            ...this.userState.value,
            loading: false,
          });
        })
      );
  }

  getUserById(id: string): void {
    this.userState.next({
      ...this.userState.value,
      loading: true,
      error: null,
    });
    this.http
      .get<User>(`${AppConfig.API_BASE_URL}/users/${id}`)
      .pipe(
        map((user: User) => {
          this.userState.next({
            ...this.userState.value,
            selectedUser: user,
            error: null,
          });
        }),
        finalize(() => {
          this.userState.next({
            ...this.userState.value,
            loading: false,
          });
        })
      )
      .subscribe();
  }
}
