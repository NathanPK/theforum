import { Router } from 'express';
import { IVoteRepository } from '../database/repository.interface';

export function createVotesRouter(voteRepository: IVoteRepository) {
  const router = Router();

  // Set or update a vote (upsert)
  router.put('/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId, value } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      if (typeof value !== 'number' || (value !== -1 && value !== 1)) {
        return res.status(400).json({ error: 'value must be either 1 (upvote) or -1 (downvote)' });
      }

      const vote = await voteRepository.setVote(postId, userId, value);
      const voteCount = await voteRepository.getVoteCount(postId);

      res.json({ vote, voteCount });
    } catch (error) {
      console.error('Error setting vote:', error);
      res.status(500).json({ error: 'Failed to set vote' });
    }
  });

  // Get a user's vote on a post
  router.get('/:postId/user/:userId', async (req, res) => {
    try {
      const { postId, userId } = req.params;
      const vote = await voteRepository.getVote(postId, userId);

      if (!vote) {
        return res.json({ vote: null });
      }

      res.json({ vote });
    } catch (error) {
      console.error('Error fetching vote:', error);
      res.status(500).json({ error: 'Failed to fetch vote' });
    }
  });

  // Delete a vote
  router.delete('/:postId/user/:userId', async (req, res) => {
    try {
      const { postId, userId } = req.params;
      await voteRepository.deleteVote(postId, userId);

      const voteCount = await voteRepository.getVoteCount(postId);
      res.json({ success: true, voteCount });
    } catch (error) {
      console.error('Error deleting vote:', error);
      res.status(500).json({ error: 'Failed to delete vote' });
    }
  });

  // Get vote count for a post
  router.get('/:postId/count', async (req, res) => {
    try {
      const { postId } = req.params;
      const voteCount = await voteRepository.getVoteCount(postId);
      res.json({ voteCount });
    } catch (error) {
      console.error('Error fetching vote count:', error);
      res.status(500).json({ error: 'Failed to fetch vote count' });
    }
  });

  return router;
}
