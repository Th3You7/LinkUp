import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHeart,
  faComment,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

interface AvatarUser {
  src: string;
  alt: string;
}

interface Post {
  user: {
    name: string;
    avatar: string;
    timestamp: string;
  };
  likes: string;
  comments: string;
}

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

  // Font Awesome icons for reactions and comments
  faHeart = faHeart;
  faComment = faComment;
  faThumbsUp = faThumbsUp;
}
