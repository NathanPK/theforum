import { PrismaClient } from '@prisma/client';
import { IPostRepository, IUserRepository, IVoteRepository } from './repository.interface';
import { User, Post, PostWithData, CreatePostInput, CreateUserInput, Vote } from './types';

const prisma = new PrismaClient();

async function calculateVoteCount(postId: string): Promise<number> {
  const result = await prisma.vote.aggregate({
    where: { postId },
    _sum: { value: true },
  });
  return result._sum.value || 0;
}

export class PrismaPostRepository implements IPostRepository {
  async findPostsByParentId(parentId: string | null): Promise<PostWithData[]> {
    const posts = await prisma.post.findMany({
      where: { parentId },
      include: {
        postData: true,
        author: true,
      },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const postsWithVotes = await Promise.all(
      posts.map(async (post) => {
        const votes = await calculateVoteCount(post.id);
        return {
          id: post.id,
          parentId: post.parentId,
          title: post.title,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          votes,
          pinned: post.pinned,
          content: post.postData?.content || '',
          author: {
            id: post.author.id,
            parentUserId: post.author.parentUserId,
            name: post.author.name,
            bio: post.author.bio,
          },
        };
      })
    );

    return postsWithVotes;
  }

  async findPostById(id: string): Promise<PostWithData | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postData: true,
        author: true,
      },
    });

    if (!post) return null;

    const votes = await calculateVoteCount(post.id);

    return {
      id: post.id,
      parentId: post.parentId,
      title: post.title,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      votes,
      pinned: post.pinned,
      content: post.postData?.content || '',
      author: {
        id: post.author.id,
        parentUserId: post.author.parentUserId,
        name: post.author.name,
        bio: post.author.bio,
      },
    };
  }

  async createPost(data: CreatePostInput): Promise<PostWithData> {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        authorId: data.authorId,
        parentId: data.parentId,
        pinned: data.pinned || false,
        postData: {
          create: {
            content: data.content,
          },
        },
      },
      include: {
        postData: true,
        author: true,
      },
    });

    return {
      id: post.id,
      parentId: post.parentId,
      title: post.title,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      votes: 0, // New posts start with 0 votes
      pinned: post.pinned,
      content: post.postData?.content || '',
      author: {
        id: post.author.id,
        parentUserId: post.author.parentUserId,
        name: post.author.name,
        bio: post.author.bio,
      },
    };
  }
}

export class PrismaUserRepository implements IUserRepository {
  async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserInput): Promise<User> {
    return await prisma.user.create({
      data: {
        name: data.name,
        bio: data.bio || '',
        parentUserId: data.parentUserId || null,
      },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }
}

export class PrismaVoteRepository implements IVoteRepository {
  async setVote(postId: string, userId: string, value: number): Promise<Vote> {
    const vote = await prisma.vote.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      update: {
        value,
      },
      create: {
        postId,
        userId,
        value,
      },
    });

    return {
      postId: vote.postId,
      userId: vote.userId,
      value: vote.value,
    };
  }

  async getVote(postId: string, userId: string): Promise<Vote | null> {
    const vote = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!vote) return null;

    return {
      postId: vote.postId,
      userId: vote.userId,
      value: vote.value,
    };
  }

  async deleteVote(postId: string, userId: string): Promise<void> {
    await prisma.vote.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  }

  async getVoteCount(postId: string): Promise<number> {
    return calculateVoteCount(postId);
  }
}

export { prisma };
