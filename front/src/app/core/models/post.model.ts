import { User } from './user.model';

export interface Post {
  id: string;
  title?: string;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  userFirstName: string;
  userLastName: string;
  username: string;
  commentCount: number;
  reactionCount: number;
}

export interface CreatePostData {
  title: string;
  image?: string;
  content: string;
  userId: string;
}
