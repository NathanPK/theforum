import express from 'express';
import cors from 'cors';
import { PrismaPostRepository, PrismaUserRepository, PrismaVoteRepository } from './database/prisma.repository';
import { createPostsRouter } from './routes/posts';
import { createUsersRouter } from './routes/users';
import { createVotesRouter } from './routes/votes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize repositories
const postRepository = new PrismaPostRepository();
const userRepository = new PrismaUserRepository();
const voteRepository = new PrismaVoteRepository();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/posts', createPostsRouter(postRepository));
app.use('/api/users', createUsersRouter(userRepository));
app.use('/api/votes', createVotesRouter(voteRepository));

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
