import { User } from './user.model';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userFirstName: string;
  userLastName: string;
  username: string;
  userId: string;
  postId: string;
  replyCount: number;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  userId: string;
}
