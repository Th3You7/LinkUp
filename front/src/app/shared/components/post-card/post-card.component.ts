import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faComment,
  faThumbsUp,
  faEllipsisV,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../../core/models/post.model';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() index!: number;
  @Input() loading: boolean | null = false;
  @Input() error: string | null = null;
  @Output() openPostPreview = new EventEmitter<Post>();

  // Font Awesome icons for reactions and comments
  faHeart = faHeart;
  faComment = faComment;
  faThumbsUp = faThumbsUp;
  faEllipsisV = faEllipsisV;
  faEdit = faEdit;
  faTrash = faTrash;

  isDropdownOpen = false;
  currentUser: User | null = null;
  private postService = inject(PostService);

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  isPostOwner(): boolean {
    if (!this.currentUser || !this.post) return false;
    return this.currentUser.id === this.post.userId;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onPostClick(event: Event): void {
    // Don't open modal if clicking on dropdown or action buttons
    const target = event.target as HTMLElement;
    if (
      target.closest('.dropdown-container') ||
      target.closest('button') ||
      target.closest('.post-actions')
    ) {
      return;
    }

    this.openPostPreview.emit(this.post);
  }

  onEditPost(): void {
    console.log('Edit post:', this.post);
    // TODO: Implement edit functionality
    // You can open a modal, navigate to edit page, or show edit form
    alert('Edit functionality coming soon!');
    this.isDropdownOpen = false;
  }

  onDeletePost(): void {
    if (
      confirm(
        'Are you sure you want to delete this post? This action cannot be undone.'
      )
    ) {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          // The post will be automatically removed from the posts$ observable
          // due to the service state management
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
        },
      });
      this.isDropdownOpen = false;
    }
  }
}
