import { User } from './user.model';

export interface Reaction {
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  postId: string;
}

export interface CreateReactionData {
  type: string;
  postId: string;
  userId: string;
}
