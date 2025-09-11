import {
  Component,
  EventEmitter,
  Output,
  OnDestroy,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreatePostData } from '../../../core/models/post.model';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent implements OnDestroy {
  @Output() postCreated = new EventEmitter<void>();

  postService = inject(PostService);
  authService = inject(AuthService);

  postTitle: string = '';
  postContent: string = '';
  selectedFiles: File[] = [];
  isModalOpen: boolean = false;
  dragOver: boolean = false;
  private fileUrls: string[] = [];

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  ngOnDestroy(): void {
    // Clean up file preview URLs to prevent memory leaks
    this.fileUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.isValidFileType(file)) {
          this.selectedFiles.push(file);
        }
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (this.isValidFileType(file)) {
          this.selectedFiles.push(file);
        }
      }
    }
  }

  removeFile(index: number): void {
    // Clean up the URL for the removed file
    if (this.fileUrls[index]) {
      URL.revokeObjectURL(this.fileUrls[index]);
      this.fileUrls.splice(index, 1);
    }
    this.selectedFiles.splice(index, 1);
  }

  isValidFileType(file: File): boolean {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const validVideoTypes = [
      'video/mp4',
      'video/avi',
      'video/mov',
      'video/wmv',
    ];

    return (
      validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)
    );
  }

  getFileType(file: File): string {
    if (file.type.startsWith('image/')) {
      return 'image';
    } else if (file.type.startsWith('video/')) {
      return 'video';
    }
    return 'unknown';
  }

  getFilePreview(file: File): string {
    const url = URL.createObjectURL(file);
    this.fileUrls.push(url);
    return url;
  }

  createPost(): void {
    if (this.postContent.trim() || this.selectedFiles.length > 0) {
      const postData: CreatePostData = {
        title: this.postTitle,
        image: '',
        content: this.postContent,
        //mediaFiles: this.selectedFiles,
        userId: this.authService.getCurrentUser()?.id || '',
      };

      this.postService.createPost(postData).subscribe((post) => {
        console.log(post);
        this.resetForm();
        this.postCreated.emit(); // Emit event when post is created
      });
      this.closeModal();
    }
  }

  private resetForm(): void {
    this.postContent = '';
    // Clean up file URLs
    this.fileUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.fileUrls = [];
    this.selectedFiles = [];
  }
}
