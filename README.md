# theforum
A tool for organizing movements and ideas

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- (Optional) [just](https://github.com/casey/just) command runner

### Running the Application

**Option 1: Using docker-compose directly**
```bash
docker-compose up --build
```

**Option 2: Using justfile (if you have `just` installed)**
```bash
just start
```

Once running, visit **http://localhost:3000** in your browser to see the application.

### Available Commands

If using docker-compose directly:
- `docker-compose up --build` - Start all services
- `docker-compose down` - Stop all services
- `docker-compose logs -f` - View logs

If using justfile:
- `just start` - Start all services (attached mode)
- `just up` - Start all services (detached mode)
- `just down` - Stop all services
- `just logs` - View logs
- `just clean` - Stop and remove volumes
- `just rebuild` - Rebuild and restart

## Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker + Docker Compose

### Project Structure
```
theforum/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── Dockerfile
├── backend/           # Express backend
│   ├── src/
│   │   ├── database/    # Prisma + repository layer
│   │   ├── routes/      # API routes
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
└── docker-compose.yml
```

The Forum is a message board web app which is optimized for mobile. The key mechanics are the following:
1. The main view is a message board, reddit style. The screen is a list of posts. The very first post is also the owner of the message board.
2. The top left corner of the screen has a back button, which takes you to the previous view. On mobile, you can swipe right to return to the previous view.
3. This message board is recursive. This means that every post is linked to its own message board. By clicking on a post, the user will navigate to the message board for that post, which can in turn contain a list of posts which are all message boards.


# Data Model
We have a dockerized postgresql container containing all of our data, including users.
We need an database api layer so that in the future we can exchange this database for a higher performance model
1. The data model for a post is as such:
- post_id: UUID (primary key)
- parent_id: UUID (indexed)
- title: str
- author: UUID
- created_at: timestamp
- updated_at: timestamp
- author: UUID
- pinned: bool (default false)
2. The daata model for post data (held separately to handle large content bodies, 1:1 relationship with posts)
- post_id: UUID (primary key)
- content: str
3. The data model for a user is as such:
- user_id: UUID (primary key)
- parent_user_id: UUID
- name: str
- bio: str
4. The data model for vote data
- post_id
- user_id
- value

# UI
1. A post is rendered as its title, author, and content. An individual post looks very much like a reddit post.
2. A message board is rendered as a list of posts, with the very first post (header_post_id) acting as the title and description for the message board

# Login
There is a login page