import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTimes,
  faHeart,
  faComment,
  faThumbsUp,
  faEllipsisV,
  faTrash,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { User } from '../../../core/models/user.model';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReactionService } from '../../../core/services/reaction.service';

@Component({
  selector: 'app-post-preview',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './post-preview.component.html',
  styleUrl: './post-preview.component.css',
})
export class PostPreviewComponent implements OnInit, OnDestroy {
  @Input() post: Post | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private reactionService = inject(ReactionService);

  // Font Awesome icons
  faTimes = faTimes;
  faHeart = faHeart;
  faComment = faComment;
  faThumbsUp = faThumbsUp;
  faEllipsisV = faEllipsisV;
  faTrash = faTrash;
  faPaperPlane = faPaperPlane;

  // Component state
  $comments = this.commentService.comments$;
  $commentsLoading = this.commentService.commentsLoading$;
  $commentsError = this.commentService.commentsError$;

  newComment = '';
  currentUser: User | null = null;
  showCommentOptions: string | null = null;
  hasReacted = false;
  isReacting = false;
  reactionCount = 0;

  ngOnInit() {
    console.log('hello sir');
    console.log(this.post?.id);
    this.currentUser = this.authService.getCurrentUser();
    this.loadComments();
    if (this.post && this.currentUser) {
      this.checkUserReaction();
      this.getReactionCount();
    }
  }

  ngOnDestroy() {
    // Clean up any subscriptions if needed
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }

  loadComments() {
    if (!this.post) return;

    this.commentService.getCommentsByPostId(this.post.id).subscribe({
      next: (comments) => {
        console.log(comments);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
      },
    });
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

  submitComment() {
    if (!this.newComment.trim() || !this.post || !this.currentUser) return;

    const commentData = {
      content: this.newComment.trim(),
      postId: this.post.id,
      userId: this.currentUser.id,
    };

    this.commentService.createComment(commentData).subscribe({
      next: (comment) => {
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        alert('Failed to post comment. Please try again.');
      },
    });
  }

  deleteComment(commentId: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error deleting comment:', error);
          alert('Failed to delete comment. Please try again.');
        },
      });
    }
    this.showCommentOptions = null;
  }

  canDeleteComment(comment: Comment): boolean | null {
    if (!this.currentUser) return false;
    return (
      comment.userId === this.currentUser.id ||
      (this.post && this.post.userId === this.currentUser.id)
    );
  }

  toggleCommentOptions(commentId: string) {
    this.showCommentOptions =
      this.showCommentOptions === commentId ? null : commentId;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  }

  getAvatarUrl(avatar: string | null | undefined): string {
    if (avatar && avatar.trim() !== '') {
      return avatar;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOCAzMEMyOCAyNS41ODIyIDI0LjQxNzggMjIgMjAgMjJDMTUuNTgyMiAyMiAxMiAyNS41ODIyIDEyIDMwSDI4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.getAvatarUrl('');
  }
}
