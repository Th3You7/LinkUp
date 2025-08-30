import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  postId: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  userId: string;
}
