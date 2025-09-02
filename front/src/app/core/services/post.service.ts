import { inject, Injectable } from '@angular/core';
import { CreatePostData, Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { AppConfig } from '../config/app.config';
import { Comment } from '../models/comment.model';
import { Reaction } from '../models/reaction.model';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  private postsState = new BehaviorSubject<PostState>({
    posts: [],
    loading: false,
    error: null,
  });

  public postsState$ = this.postsState.asObservable();

  public posts$ = this.postsState$.pipe(
    map((state: PostState) => state.posts || [])
  );

  public loading$ = this.postsState$.pipe(
    map((state: PostState) => state.loading)
  );

  public error$ = this.postsState$.pipe(map((state: PostState) => state.error));

  createPost(post: CreatePostData): Observable<Post> {
    this.postsState.next({
      ...this.postsState.value,
      loading: true,
    });
    return this.http.post<Post>(`${AppConfig.API_BASE_URL}/posts`, post).pipe(
      tap((post: Post) => {
        this.postsState.next({
          ...this.postsState.value,
          posts: [...this.postsState.value.posts, post],
        });
      }),
      finalize(() => {
        this.postsState.next({
          ...this.postsState.value,
          loading: false,
        });
      })
    );
  }

  getPosts(): Observable<Post[]> {
    this.postsState.next({
      ...this.postsState.value,
      loading: true,
      error: null,
    });

    return this.http.get<any>(`${AppConfig.API_BASE_URL}/posts`).pipe(
      map((response: any) => {
        // Handle both array and paginated response
        if (Array.isArray(response)) {
          return response;
        } else if (
          response &&
          response.content &&
          Array.isArray(response.content)
        ) {
          return response.content;
        } else {
          console.warn('Unexpected response format:', response);
          return [];
        }
      }),
      tap((posts: Post[]) => {
        console.log('Posts in tap:', posts);
        this.postsState.next({
          ...this.postsState.value,
          posts: posts || [],
          error: null,
        });
      }),
      catchError((error: any) => {
        this.postsState.next({
          ...this.postsState.value,
          posts: [],
          error: error.message || 'Failed to fetch posts',
        });
        return throwError(() => error);
      }),
      finalize(() => {
        this.postsState.next({
          ...this.postsState.value,
          loading: false,
        });
      })
    );
  }

  getPostById(id: string): Observable<Post> {
    this.postsState.next({
      ...this.postsState.value,
      loading: true,
    });
    return this.http.get<Post>(`${AppConfig.API_BASE_URL}/posts/${id}`).pipe(
      tap((post: Post) => {
        this.postsState.next({
          ...this.postsState.value,
          posts: [...this.postsState.value.posts, post],
        });
      }),
      catchError((error: any) => {
        this.postsState.next({
          ...this.postsState.value,
          error: error.message,
        });
        return throwError(() => error);
      }),
      finalize(() => {
        this.postsState.next({
          ...this.postsState.value,
          loading: false,
        });
      })
    );
  }

  updatePost(id: string, post: Post): Observable<Post> {
    this.postsState.next({
      ...this.postsState.value,
      loading: true,
    });
    return this.http
      .put<Post>(`${AppConfig.API_BASE_URL}/posts/${id}`, post)
      .pipe(
        tap((post: Post) => {
          this.postsState.next({
            ...this.postsState.value,
            posts: [...this.postsState.value.posts, post],
          });
        }),
        catchError((error: any) => {
          this.postsState.next({
            ...this.postsState.value,
            error: error.message,
          });
          return throwError(() => error);
        }),
        finalize(() => {
          this.postsState.next({
            ...this.postsState.value,
            loading: false,
          });
        })
      );
  }

  deletePost(id: string): Observable<void> {
    this.postsState.next({
      ...this.postsState.value,
      loading: true,
    });
    return this.http.delete<void>(`${AppConfig.API_BASE_URL}/posts/${id}`).pipe(
      tap(() => {
        this.postsState.next({
          ...this.postsState.value,
          posts: this.postsState.value.posts.filter((post) => post.id !== id),
        });
      }),
      catchError((error: any) => {
        this.postsState.next({
          ...this.postsState.value,
          error: error.message,
        });
        return throwError(() => error);
      }),
      finalize(() => {
        this.postsState.next({
          ...this.postsState.value,
          loading: false,
        });
      })
    );
  }

  likePost(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${AppConfig.API_BASE_URL}/posts/${id}/like`)
      .pipe(
        tap((post: Post) => {
          this.postsState.next({
            ...this.postsState.value,
            posts: [...this.postsState.value.posts, post],
          });
        }),
        catchError((error: any) => {
          this.postsState.next({
            ...this.postsState.value,
            error: error.message,
          });
          return throwError(() => error);
        })
      );
  }

  commentPost(id: string, comment: string): Observable<Post> {
    return this.http
      .post<Post>(`${AppConfig.API_BASE_URL}/posts/${id}/comment`, { comment })
      .pipe(
        tap((post: Post) => {
          this.postsState.next({
            ...this.postsState.value,
            posts: [...this.postsState.value.posts, post],
          });
        }),
        catchError((error: any) => {
          this.postsState.next({
            ...this.postsState.value,
            error: error.message,
          });
          return throwError(() => error);
        })
      );
  }

  getComments(id: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(`${AppConfig.API_BASE_URL}/posts/${id}/comments`)
      .pipe(
        tap((comments: Comment[]) => {
          this.postsState.next({
            ...this.postsState.value,
            posts: this.postsState.value.posts.map((post) =>
              post.id === id ? { ...post, comments: comments } : post
            ),
          });
        }),
        catchError((error: any) => {
          this.postsState.next({
            ...this.postsState.value,
            error: error.message,
          });
          return throwError(() => error);
        })
      );
  }

  getReactions(id: string): Observable<Reaction[]> {
    return this.http
      .get<Reaction[]>(`${AppConfig.API_BASE_URL}/posts/${id}/reactions`)
      .pipe(
        tap((reactions: Reaction[]) => {
          this.postsState.next({
            ...this.postsState.value,
            posts: this.postsState.value.posts.map((post) =>
              post.id === id ? { ...post, reactions: reactions } : post
            ),
          });
        }),
        catchError((error: any) => {
          this.postsState.next({
            ...this.postsState.value,
            error: error.message,
          });
          return throwError(() => error);
        })
      );
  }
}
