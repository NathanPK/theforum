import { Router } from 'express';
import { IPostRepository } from '../database/repository.interface';

export function createPostsRouter(postRepository: IPostRepository) {
  const router = Router();

  // Get posts by parent ID (null for root level)
  router.get('/', async (req, res) => {
    try {
      const parentId = req.query.parentId as string | undefined;
      const posts = await postRepository.findPostsByParentId(parentId || null);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // Get a specific post by ID
  router.get('/:id', async (req, res) => {
    try {
      const post = await postRepository.findPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // Create a new post
  router.post('/', async (req, res) => {
    try {
      const { title, content, authorId, parentId, pinned } = req.body;

      if (!title || !content || !authorId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const post = await postRepository.createPost({
        title,
        content,
        authorId,
        parentId: parentId || null,
        pinned: pinned || false,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  return router;
}
