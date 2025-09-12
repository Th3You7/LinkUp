import { inject, Injectable } from '@angular/core';
import {
  Friendship,
  CreateFriendshipRequest,
  FriendshipStatus,
  FriendshipState,
} from '../models/friendship.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { AppConfig } from '../config/app.config';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  private http = inject(HttpClient);
  private chatService = inject(ChatService);
  private state = new BehaviorSubject<FriendshipState>({
    friendships: [],
    friends: [],
    pendingRequests: [],
    sentRequests: [],
    loading: false,
    error: null,
  });

  state$ = this.state.asObservable();
  friendships$ = this.state$.pipe(
    map((state: FriendshipState) => state.friendships)
  );
  friends$ = this.state$.pipe(map((state: FriendshipState) => state.friends));
  pendingRequests$ = this.state$.pipe(
    map((state: FriendshipState) => state.pendingRequests)
  );
  sentRequests$ = this.state$.pipe(
    map((state: FriendshipState) => state.sentRequests)
  );
  loading$ = this.state$.pipe(map((state: FriendshipState) => state.loading));
  error$ = this.state$.pipe(map((state: FriendshipState) => state.error));

  constructor() {}

  // Send friendship request
  sendFriendshipRequest(
    senderId: string,
    request: CreateFriendshipRequest
  ): Observable<Friendship> {
    this.setLoading(true);
    const params = new HttpParams().set('senderId', senderId);

    return this.http
      .post<Friendship>(AppConfig.FRIENDSHIP_ENDPOINTS.SEND_REQUEST, request, {
        params,
      })
      .pipe(
        tap((friendship) => {
          this.updateState({
            sentRequests: [...this.state.value.sentRequests, friendship],
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to send friendship request');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Accept friendship request
  acceptFriendshipRequest(
    friendshipId: string,
    userId: string
  ): Observable<Friendship> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .put<Friendship>(
        `${AppConfig.FRIENDSHIP_ENDPOINTS.ACCEPT_REQUEST}/${friendshipId}/accept`,
        {},
        { params }
      )
      .pipe(
        tap((friendship) => {
          const currentState = this.state.value;
          const updatedPending = currentState.pendingRequests.filter(
            (f) => f.id !== friendshipId
          );
          const updatedFriends = [...currentState.friends, friendship];

          this.updateState({
            pendingRequests: updatedPending,
            friends: updatedFriends,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to accept friendship request');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Reject friendship request
  rejectFriendshipRequest(
    friendshipId: string,
    userId: string
  ): Observable<void> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .delete<void>(
        `${AppConfig.FRIENDSHIP_ENDPOINTS.REJECT_REQUEST}/${friendshipId}/reject`,
        { params }
      )
      .pipe(
        tap(() => {
          const currentState = this.state.value;
          const updatedPending = currentState.pendingRequests.filter(
            (f) => f.id !== friendshipId
          );

          this.updateState({
            pendingRequests: updatedPending,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to reject friendship request');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Cancel friendship request
  cancelFriendshipRequest(
    friendshipId: string,
    userId: string
  ): Observable<void> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);
    return this.http
      .delete<void>(
        `${AppConfig.FRIENDSHIP_ENDPOINTS.CANCEL_REQUEST}/${friendshipId}/cancel`,
        { params }
      )
      .pipe(
        tap(() => {
          const currentState = this.state.value;
          const updatedPending = currentState.pendingRequests.filter(
            (f) => f.id !== friendshipId
          );
          this.updateState({
            pendingRequests: updatedPending,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to cancel friendship request');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Remove friend
  removeFriend(userId: string, friendId: string): Observable<void> {
    this.setLoading(true);
    const params = new HttpParams()
      .set('userId', userId)
      .set('friendId', friendId);

    return this.http
      .delete<void>(AppConfig.FRIENDSHIP_ENDPOINTS.REMOVE_FRIEND, { params })
      .pipe(
        tap(() => {
          const currentState = this.state.value;
          const updatedFriends = currentState.friends.filter(
            (f) => f.sender.id !== friendId && f.receiver.id !== friendId
          );

          this.updateState({
            friends: updatedFriends,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to remove friend');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Block user
  blockUser(userId: string, userToBlockId: string): Observable<Friendship> {
    this.setLoading(true);
    const params = new HttpParams()
      .set('userId', userId)
      .set('userToBlockId', userToBlockId);

    return this.http
      .post<Friendship>(
        AppConfig.FRIENDSHIP_ENDPOINTS.BLOCK_USER,
        {},
        { params }
      )
      .pipe(
        tap((friendship) => {
          const currentState = this.state.value;
          const updatedFriends = currentState.friends.filter(
            (f) =>
              f.sender.id !== userToBlockId && f.receiver.id !== userToBlockId
          );

          this.updateState({
            friends: updatedFriends,
            friendships: [
              ...currentState.friendships.filter((f) => f.id !== friendship.id),
              friendship,
            ],
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to block user');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Unblock user
  unblockUser(userId: string, userToUnblockId: string): Observable<void> {
    this.setLoading(true);
    const params = new HttpParams()
      .set('userId', userId)
      .set('userToUnblockId', userToUnblockId);

    return this.http
      .delete<void>(AppConfig.FRIENDSHIP_ENDPOINTS.UNBLOCK_USER, { params })
      .pipe(
        tap(() => {
          const currentState = this.state.value;
          const updatedFriendships = currentState.friendships.filter(
            (f) =>
              !(
                f.sender.id === userToUnblockId ||
                f.receiver.id === userToUnblockId
              ) || f.status !== FriendshipStatus.BLOCKED
          );

          this.updateState({
            friendships: updatedFriendships,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to unblock user');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Get all friends
  getFriends(userId: string): Observable<Friendship[]> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .get<Friendship[]>(AppConfig.FRIENDSHIP_ENDPOINTS.GET_FRIENDS, { params })
      .pipe(
        tap((friends) => {
          this.updateState({
            friends,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to load friends');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Get pending friendship requests
  getPendingRequests(userId: string): Observable<Friendship[]> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .get<Friendship[]>(AppConfig.FRIENDSHIP_ENDPOINTS.GET_PENDING, { params })
      .pipe(
        tap((pendingRequests) => {
          this.updateState({
            pendingRequests,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to load pending requests');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Get sent friendship requests
  getSentRequests(userId: string): Observable<Friendship[]> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .get<Friendship[]>(AppConfig.FRIENDSHIP_ENDPOINTS.GET_SENT, { params })
      .pipe(
        tap((sentRequests) => {
          this.updateState({
            sentRequests,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to load sent requests');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Get all friendships
  getAllFriendships(userId: string): Observable<Friendship[]> {
    this.setLoading(true);
    const params = new HttpParams().set('userId', userId);

    return this.http
      .get<Friendship[]>(AppConfig.FRIENDSHIP_ENDPOINTS.GET_ALL, { params })
      .pipe(
        tap((friendships) => {
          this.updateState({
            friendships,
            loading: false,
            error: null,
          });
        }),
        catchError((error) => {
          this.setError('Failed to load friendships');
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  // Get friendship status between two users
  getFriendshipStatus(
    userId1: string,
    userId2: string
  ): Observable<Friendship | null> {
    const params = new HttpParams()
      .set('userId1', userId1)
      .set('userId2', userId2);

    return this.http
      .get<Friendship>(AppConfig.FRIENDSHIP_ENDPOINTS.GET_STATUS, { params })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }
          this.setError('Failed to get friendship status');
          return throwError(() => error);
        })
      );
  }

  // Check if two users are friends
  areFriends(userId1: string, userId2: string): Observable<boolean> {
    const params = new HttpParams()
      .set('userId1', userId1)
      .set('userId2', userId2);

    return this.http
      .get<boolean>(AppConfig.FRIENDSHIP_ENDPOINTS.CHECK_FRIENDS, { params })
      .pipe(
        catchError((error) => {
          this.setError('Failed to check friendship status');
          return throwError(() => error);
        })
      );
  }

  // Get friendship by ID
  getFriendshipById(friendshipId: string): Observable<Friendship> {
    return this.http
      .get<Friendship>(
        `${AppConfig.FRIENDSHIP_ENDPOINTS.GET_BY_ID}/${friendshipId}`
      )
      .pipe(
        catchError((error) => {
          this.setError('Failed to get friendship');
          return throwError(() => error);
        })
      );
  }

  // Refresh all friendship data for a user
  refreshFriendshipData(userId: string): Observable<void> {
    this.setLoading(true);

    return this.getAllFriendships(userId).pipe(
      tap(() => {
        // Load friends, pending, and sent requests in parallel
        this.getFriends(userId).subscribe();
        this.getPendingRequests(userId).subscribe();
        this.getSentRequests(userId).subscribe();
      }),
      map(() => void 0),
      catchError((error) => {
        this.setError('Failed to refresh friendship data');
        return throwError(() => error);
      }),
      finalize(() => this.setLoading(false))
    );
  }

  // Helper methods
  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  private setError(error: string): void {
    this.updateState({ error, loading: false });
  }

  private updateState(partialState: Partial<FriendshipState>): void {
    this.state.next({ ...this.state.value, ...partialState });
  }

  // Clear error
  clearError(): void {
    this.updateState({ error: null });
  }

  // Reset state
  resetState(): void {
    this.state.next({
      friendships: [],
      friends: [],
      pendingRequests: [],
      sentRequests: [],
      loading: false,
      error: null,
    });
  }

  /**
   * Start a chat session with a friend
   */
  startChatWithFriend(
    friendId: string,
    currentUserId: string
  ): Observable<any> {
    return this.chatService.createChatSession(currentUserId, friendId);
  }
}
