import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
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
import { ReactionService } from '../../../core/services/reaction.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent implements OnInit {
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
  hasReacted = false;
  isReacting = false;
  reactionCount = 0;

  private postService = inject(PostService);
  private reactionService = inject(ReactionService);

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.post && this.currentUser) {
      this.checkUserReaction();
      this.getReactionCount();
    }
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

  async toggleReaction(event: Event): Promise<void> {
    event.stopPropagation();

    if (!this.currentUser || !this.post || this.isReacting) return;

    this.isReacting = true;

    try {
      if (this.hasReacted) {
        // Remove reaction
        await this.reactionService
          .deleteReactionByPostAndUser(this.post.id, this.currentUser.id)
          .toPromise();
        this.hasReacted = false;
        this.reactionCount = Math.max(0, this.reactionCount - 1);
      } else {
        // Add reaction
        await this.reactionService
          .createReaction({
            name: 'heart',
            userId: this.currentUser.id,
            postId: this.post.id,
          })
          .toPromise();
        this.hasReacted = true;
        this.reactionCount += 1;
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      this.isReacting = false;
    }
  }

  private async checkUserReaction(): Promise<void> {
    if (!this.currentUser || !this.post) return;

    try {
      const result = await this.reactionService
        .hasUserReactedToPost(this.post.id, this.currentUser.id)
        .toPromise();
      this.hasReacted = result || false;
    } catch (error) {
      console.error('Error checking user reaction:', error);
      this.hasReacted = false;
    }
  }

  private async getReactionCount(): Promise<void> {
    if (!this.post) return;

    try {
      const result = await this.reactionService
        .getReactionCountByPostIdAndName(this.post.id, 'heart')
        .toPromise();
      this.reactionCount = result || 0;
    } catch (error) {
      console.error('Error getting reaction count:', error);
      this.reactionCount = this.post.reactionCount || 0;
    }
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
