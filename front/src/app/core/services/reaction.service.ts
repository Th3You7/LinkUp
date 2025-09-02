import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../config/app.config';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  tap,
  throwError,
} from 'rxjs';
import { Reaction, CreateReactionData } from '../models/reaction.model';

interface ReactionState {
  reactions: Reaction[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private http = inject(HttpClient);

  private reactionState = new BehaviorSubject<ReactionState>({
    reactions: [],
    loading: false,
    error: null,
  });

  state$ = this.reactionState.asObservable();

  reactions$ = this.state$.pipe(
    map((state: ReactionState) => state.reactions || [])
  );
  reactionsLoading$ = this.state$.pipe(
    map((state: ReactionState) => state.loading)
  );
  reactionsError$ = this.state$.pipe(
    map((state: ReactionState) => state.error)
  );

  createReaction(reaction: CreateReactionData) {
    this.reactionState.next({
      ...this.reactionState.value,
      loading: true,
    });
    return this.http
      .post<Reaction>(`${AppConfig.API_BASE_URL}/reactions`, reaction)
      .pipe(
        tap((reaction: Reaction) => {
          this.reactionState.next({
            ...this.reactionState.value,
            reactions: [...this.reactionState.value.reactions, reaction],
          });
        }),
        catchError((error: any) => {
          this.reactionState.next({
            ...this.reactionState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.reactionState.next({
            ...this.reactionState.value,
            loading: false,
          });
        })
      );
  }

  getReactionsByPostId(postId: string) {
    this.reactionState.next({
      ...this.reactionState.value,
      loading: true,
    });
    return this.http
      .get<Reaction[]>(`${AppConfig.API_BASE_URL}/reactions/post/${postId}`)
      .pipe(
        tap((reactions: Reaction[]) => {
          this.reactionState.next({
            ...this.reactionState.value,
            reactions: reactions,
          });
        }),
        catchError((error: any) => {
          this.reactionState.next({
            ...this.reactionState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.reactionState.next({
            ...this.reactionState.value,
            loading: false,
          });
        })
      );
  }

  deleteReactionByPostAndUser(postId: string, userId: string) {
    this.reactionState.next({
      ...this.reactionState.value,
      loading: true,
    });
    return this.http
      .delete<void>(
        `${AppConfig.API_BASE_URL}/reactions/post/${postId}/user/${userId}`
      )
      .pipe(
        tap(() => {
          this.reactionState.next({
            ...this.reactionState.value,
            reactions: this.reactionState.value.reactions.filter(
              (reaction) =>
                !(reaction.postId === postId && reaction.userId === userId)
            ),
          });
        }),
        catchError((error: any) => {
          this.reactionState.next({
            ...this.reactionState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.reactionState.next({
            ...this.reactionState.value,
            loading: false,
          });
        })
      );
  }

  hasUserReactedToPost(postId: string, userId: string) {
    return this.http.get<boolean>(
      `${AppConfig.API_BASE_URL}/reactions/post/${postId}/user/${userId}/exists`
    );
  }

  getUserReactionToPost(postId: string, userId: string) {
    return this.http.get<Reaction>(
      `${AppConfig.API_BASE_URL}/reactions/post/${postId}/user/${userId}`
    );
  }

  getReactionCountByPostId(postId: string) {
    return this.http.get<number>(
      `${AppConfig.API_BASE_URL}/reactions/post/${postId}/count`
    );
  }

  getReactionCountByPostIdAndName(postId: string, name: string) {
    return this.http.get<number>(
      `${AppConfig.API_BASE_URL}/reactions/post/${postId}/name/${name}/count`
    );
  }
}
