import { User, Post, PostWithData, CreatePostInput, CreateUserInput, Vote } from './types';

export interface IPostRepository {
  findPostsByParentId(parentId: string | null): Promise<PostWithData[]>;
  findPostById(id: string): Promise<PostWithData | null>;
  createPost(data: CreatePostInput): Promise<PostWithData>;
}

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  createUser(data: CreateUserInput): Promise<User>;
  findAllUsers(): Promise<User[]>;
}

export interface IVoteRepository {
  setVote(postId: string, userId: string, value: number): Promise<Vote>;
  getVote(postId: string, userId: string): Promise<Vote | null>;
  deleteVote(postId: string, userId: string): Promise<void>;
  getVoteCount(postId: string): Promise<number>;
}
