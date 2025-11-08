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
  createdAt: string;
  updatedAt: string;
  votes: number;
  pinned: boolean;
  content: string;
  author: User;
}
