import { User } from './user.model';

export interface FriendshipState {
  friendships: Friendship[];
  friends: Friendship[];
  pendingRequests: Friendship[];
  sentRequests: Friendship[];
  loading: boolean;
  error: string | null;
}
export interface Friendship {
  id: string;
  sender: User;
  receiver: User;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFriendshipRequest {
  receiverEmail: string;
}

export interface FriendshipStatusUpdate {
  status: FriendshipStatus;
}

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}
