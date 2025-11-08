# Start all services
start:
    docker-compose up --build

# Start all services in detached mode
up:
    docker-compose up --build -d

# Stop all services
down:
    docker-compose down

# Stop all services and remove volumes
clean:
    docker-compose down -v

# View logs
logs:
    docker-compose logs -f

# View logs for a specific service (e.g., just logs-backend)
logs-frontend:
    docker-compose logs -f frontend

logs-backend:
    docker-compose logs -f backend

logs-db:
    docker-compose logs -f postgres

# Restart all services
restart:
    docker-compose restart

# Rebuild and restart all services
rebuild:
    docker-compose down
    docker-compose up --build -d

# Run database migrations
db-push:
    docker-compose exec backend npx prisma db push

# Seed the database
db-seed:
    docker-compose exec backend npm run db:seed

# Open a shell in the backend container
shell-backend:
    docker-compose exec backend sh

# Open a shell in the frontend container
shell-frontend:
    docker-compose exec frontend sh

# Open psql in the database
db-shell:
    docker-compose exec postgres psql -U postgres -d theforum
