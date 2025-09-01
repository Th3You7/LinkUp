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
import { Comment, CreateCommentData } from '../models/comment.model';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);

  private commentState = new BehaviorSubject<CommentState>({
    comments: [],
    loading: false,
    error: null,
  });

  state$ = this.commentState.asObservable();

  comments$ = this.state$.pipe(
    map((state: CommentState) => state.comments || [])
  );
  commentsLoading$ = this.state$.pipe(
    map((state: CommentState) => state.loading)
  );
  commentsError$ = this.state$.pipe(map((state: CommentState) => state.error));

  createComment(comment: CreateCommentData) {
    this.commentState.next({
      ...this.commentState.value,
      loading: true,
    });
    return this.http
      .post<Comment>(`${AppConfig.API_BASE_URL}/comments`, comment)
      .pipe(
        tap((comment: Comment) => {
          this.commentState.next({
            ...this.commentState.value,
            comments: [...this.commentState.value.comments, comment],
          });
        }),
        catchError((error: any) => {
          this.commentState.next({
            ...this.commentState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.commentState.next({
            ...this.commentState.value,
            loading: false,
          });
        })
      );
  }

  getCommentsByPostId(postId: string) {
    this.commentState.next({
      ...this.commentState.value,
      loading: true,
    });
    return this.http
      .get<Comment[]>(`${AppConfig.API_BASE_URL}/comments/post/${postId}`)
      .pipe(
        tap((comments: Comment[]) => {
          this.commentState.next({
            ...this.commentState.value,
            comments,
          });
        }),
        catchError((error: any) => {
          this.commentState.next({
            ...this.commentState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.commentState.next({
            ...this.commentState.value,
            loading: false,
          });
        })
      );
  }

  deleteComment(id: string) {
    this.commentState.next({
      ...this.commentState.value,
      loading: true,
    });
    return this.http
      .delete<void>(`${AppConfig.API_BASE_URL}/comments/${id}`)
      .pipe(
        tap(() => {
          this.commentState.next({
            ...this.commentState.value,
            comments: this.commentState.value.comments.filter(
              (comment) => comment.id !== id
            ),
          });
        }),
        catchError((error: any) => {
          this.commentState.next({
            ...this.commentState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.commentState.next({
            ...this.commentState.value,
            loading: false,
          });
        })
      );
  }

  updateComment(id: string, comment: Comment) {
    this.commentState.next({
      ...this.commentState.value,
      loading: true,
    });
    return this.http
      .put<Comment>(`${AppConfig.API_BASE_URL}/comments/${id}`, comment)
      .pipe(
        tap((comment: Comment) => {
          this.commentState.next({
            ...this.commentState.value,
            comments: this.commentState.value.comments.map((c) =>
              c.id === id ? comment : c
            ),
          });
        }),
        catchError((error: any) => {
          this.commentState.next({
            ...this.commentState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.commentState.next({
            ...this.commentState.value,
            loading: false,
          });
        })
      );
  }
}
