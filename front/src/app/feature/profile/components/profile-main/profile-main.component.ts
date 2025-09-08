import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Post } from '../../../../core/models/post.model';
import { PostService } from '../../../../core/services/post.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CreatePostComponent } from '../../../../shared/components/create-post/create-post.component';
import { PostCardComponent } from '../../../../shared/components/post-card/post-card.component';

@Component({
  selector: 'app-profile-main',
  imports: [CommonModule, CreatePostComponent, PostCardComponent],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css',
})
export class ProfileMainComponent implements OnInit {
  private postService = inject(PostService);
  private authService = inject(AuthService);

  posts$: Observable<Post[]> = this.postService.posts$;
  loading$: Observable<boolean> = this.postService.loading$;
  error$: Observable<string | null> = this.postService.error$;

  ngOnInit() {
    // Load current user's posts when component initializes
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.postService.getPostsByUserId(currentUser.id).subscribe();
    }
  }

  onPostCreated() {
    // Refresh posts when a new post is created
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.postService.getPostsByUserId(currentUser.id).subscribe();
    }
  }
}
