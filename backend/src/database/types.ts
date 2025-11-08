export interface User {
  id: string;
  parentUserId: string | null;
  name: string;
  bio: string;
}

export interface Post {
  id: string;
  parentId: string | null;
  title: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  votes: number;
  pinned: boolean;
}

export interface PostData {
  postId: string;
  content: string;
}

export interface PostWithData extends Post {
  content: string;
  author: User;
}

export interface CreatePostInput {
  parentId: string | null;
  title: string;
  authorId: string;
  content: string;
  pinned?: boolean;
}

export interface CreateUserInput {
  name: string;
  bio?: string;
  parentUserId?: string | null;
}

export interface Vote {
  postId: string;
  userId: string;
  value: number;
}
