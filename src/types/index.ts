export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
  karma: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
  username?: string;
  avatar?:   string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  username: string;
  communityId: string;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  imageUrl?: string;
  avatar?: string;
  

}

export interface Community {
  id: string;
  name: string;
  displayName: string;
  description: string;
  memberCount: number;
  createdAt: string;
  avatar?: string;
  banner?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}