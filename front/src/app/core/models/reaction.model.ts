import { User } from './user.model';

export interface Reaction {
  id: string;
  name: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  username: string;
  postId: string;
}

export interface CreateReactionData {
  name: string;
  userId: string;
  postId: string;
}
