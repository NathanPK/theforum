import { Router } from 'express';
import { IUserRepository } from '../database/repository.interface';

export function createUsersRouter(userRepository: IUserRepository) {
  const router = Router();

  // Get all users
  router.get('/', async (req, res) => {
    try {
      const users = await userRepository.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Get a specific user by ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await userRepository.findUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Create a new user
  router.post('/', async (req, res) => {
    try {
      const { name, bio, parentUserId } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const user = await userRepository.createUser({
        name,
        bio,
        parentUserId,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  return router;
}
