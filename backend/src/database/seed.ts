import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.vote.deleteMany();
  await prisma.postData.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      bio: 'Community organizer and tech enthusiast',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      bio: 'Developer and open source contributor',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Carol Williams',
      bio: 'Designer and creative thinker',
    },
  });

  // Create root-level board (main forum)
  const mainBoard = await prisma.post.create({
    data: {
      title: 'Welcome to The Forum',
      authorId: user1.id,
      parentId: null,
      pinned: true,
      postData: {
        create: {
          content: 'This is The Forum - a place for organizing movements and ideas. Click on any post to see its discussion board!',
        },
      },
    },
  });

  // Create top-level posts (sub-forums)
  const techPost = await prisma.post.create({
    data: {
      title: 'Technology Discussion',
      authorId: user2.id,
      parentId: null,
      postData: {
        create: {
          content: 'A place to discuss all things tech - programming, gadgets, and innovations.',
        },
      },
    },
  });

  const communityPost = await prisma.post.create({
    data: {
      title: 'Community Events',
      authorId: user1.id,
      parentId: null,
      postData: {
        create: {
          content: 'Share and discuss upcoming community events and meetups.',
        },
      },
    },
  });

  // Create nested posts under Technology Discussion
  const reactPost = await prisma.post.create({
    data: {
      title: 'React Best Practices',
      authorId: user2.id,
      parentId: techPost.id,
      postData: {
        create: {
          content: 'Let\'s discuss React best practices for building scalable applications. What patterns do you use?',
        },
      },
    },
  });

  const dockerPost = await prisma.post.create({
    data: {
      title: 'Docker Tips and Tricks',
      authorId: user3.id,
      parentId: techPost.id,
      postData: {
        create: {
          content: 'Share your favorite Docker tips! I\'ll start: use multi-stage builds to reduce image size.',
        },
      },
    },
  });

  // Create nested posts under React Best Practices (showing recursive nature)
  const componentPost = await prisma.post.create({
    data: {
      title: 'Component Structure',
      authorId: user1.id,
      parentId: reactPost.id,
      postData: {
        create: {
          content: 'How do you organize your React components? Do you prefer feature-based or type-based folders?',
        },
      },
    },
  });

  // Create posts under Community Events
  const meetupPost = await prisma.post.create({
    data: {
      title: 'Monthly Meetup - June',
      authorId: user1.id,
      parentId: communityPost.id,
      pinned: true,
      postData: {
        create: {
          content: 'Join us for our monthly community meetup! This month we\'re discussing grassroots organizing strategies.',
        },
      },
    },
  });

  const workshopPost = await prisma.post.create({
    data: {
      title: 'Workshop: Public Speaking',
      authorId: user3.id,
      parentId: communityPost.id,
      postData: {
        create: {
          content: 'Free workshop on public speaking and presentation skills. Saturday at 2 PM!',
        },
      },
    },
  });

  // Create votes for posts
  // Technology Discussion: upvotes from all users
  await prisma.vote.createMany({
    data: [
      { postId: techPost.id, userId: user1.id, value: 1 },
      { postId: techPost.id, userId: user2.id, value: 1 },
      { postId: techPost.id, userId: user3.id, value: 1 },
    ],
  });

  // Community Events: upvotes from 2 users
  await prisma.vote.createMany({
    data: [
      { postId: communityPost.id, userId: user1.id, value: 1 },
      { postId: communityPost.id, userId: user2.id, value: 1 },
    ],
  });

  // React Best Practices: upvotes from 2 users
  await prisma.vote.createMany({
    data: [
      { postId: reactPost.id, userId: user1.id, value: 1 },
      { postId: reactPost.id, userId: user3.id, value: 1 },
    ],
  });

  // Docker Tips: upvote from 1 user
  await prisma.vote.create({
    data: { postId: dockerPost.id, userId: user1.id, value: 1 },
  });

  // Component Structure: upvote from 1 user
  await prisma.vote.create({
    data: { postId: componentPost.id, userId: user2.id, value: 1 },
  });

  // Monthly Meetup: upvotes from 2 users
  await prisma.vote.createMany({
    data: [
      { postId: meetupPost.id, userId: user2.id, value: 1 },
      { postId: meetupPost.id, userId: user3.id, value: 1 },
    ],
  });

  // Workshop: upvote from 1 user
  await prisma.vote.create({
    data: { postId: workshopPost.id, userId: user1.id, value: 1 },
  });

  console.log('Database seeded successfully!');
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.post.count()} posts`);
  console.log(`Created ${await prisma.vote.count()} votes`);
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
