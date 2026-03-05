# Quick Reference: Docker Operations

## 🚀 Quick Start (Choose One)

### Development
```bash
# Using docker-compose directly
docker-compose -f docker-compose.yml -f docker-compose.develop.yml up

# Using Makefile (recommended)
make dev
```

### Testing
```bash
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
# or
make test
```

### Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# or
make prod
```

---

## 📝 Makefile Quick Commands

```bash
make help           # Show all available commands
make dev            # Start development environment
make test           # Start testing environment
make prod           # Start production environment

make dev-logs       # View development logs
make prod-logs      # View production logs

make dev-shell      # SSH into development app
make dev-mongo-shell # SSH into MongoDB

make all-stop       # Stop all environments
make ps             # Show running containers
make health         # Check health of all services
```

---

## 🐳 Essential Docker Compose Commands

```bash
# View status
docker-compose ps
docker-compose logs
docker-compose logs -f                          # Follow logs
docker-compose logs app                         # Specific service

# Control services
docker-compose up                               # Start in foreground
docker-compose up -d                            # Start in background
docker-compose up --build                       # Rebuild images
docker-compose down                             # Stop all services
docker-compose down -v                          # Stop and remove volumes
docker-compose restart                          # Restart services
docker-compose restart app                      # Restart specific service

# Others
docker-compose ps                               # List containers
docker-compose exec app npm list                # Run command in container
docker-compose exec app sh                      # Open shell in container
```

---

## 🗄️ Database Operations

### Connect to MongoDB
```bash
# Development
docker exec -it job_mongodb_dev mongosh -u admin -p admin123

# Production
docker exec -it job_mongodb_prod mongosh -u admin -p YOUR_PASSWORD
```

### Backup Database
```bash
# Development
docker exec job_mongodb_dev mongodump --archive=/data/db/backup.archive

# Production
docker exec job_mongodb_prod mongodump --archive=/data/db/backup.archive
```

### Restore Database
```bash
docker exec job_mongodb_prod mongorestore --archive=/data/db/backup.archive
```

---

## 🔍 Debugging & Monitoring

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs mongodb
docker-compose logs nginx

# Follow in real-time
docker-compose logs -f app

# Last N lines
docker-compose logs --tail 100
```

### Monitor Resources
```bash
docker stats                    # Live CPU, memory, network, I/O
docker stats --no-stream       # One-time snapshot
```

### Check Service Health
```bash
# Curl the health endpoint
curl http://localhost:3000/health          # Dev app
curl http://localhost:3001/health          # Test app
curl https://yourdomain.com/health         # Production

# Or check docker health
docker-compose ps
# Look at STATUS column - (healthy) or (unhealthy)
```

### Execute Commands in Container
```bash
# List dependencies
docker exec job_app_prod npm list

# Check environment
docker exec job_app_prod env | grep DATABASE

# Run a one-off command
docker exec job_app_prod npx prisma migrate status
```

---

## 🔧 Build & Deploy

### Build Images
```bash
# Using compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Full rebuild without cache
docker-compose build --no-cache
```

### Push to Registry
```bash
# Tag image
docker tag job:latest registry.example.com/job:latest

# Push
docker push registry.example.com/job:latest
```

---

## 🗑️ Cleanup

```bash
# Stop all containers
docker-compose down

# Remove containers and volumes (DELETES DATA!)
docker-compose down -v

# Prune unused images/containers/volumes
docker system prune
docker system prune -a              # Also remove unused images

# Remove specific image
docker image rm image_id

# Remove specific volume
docker volume rm volume_name
```

---

## 🔐 Environment & Configuration

### View Current Environment
```bash
# Check current env file
cat .env.local

# View env variables in container
docker exec job_app_prod env | grep DATABASE_URL
```

### Update Environment
```bash
# Edit .env file
nano .env.local

# Rebuild and restart (if needed)
docker-compose up --build -d
```

### Generate Secure Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate password
openssl rand -base64 16
```

---

## 🌐 Port & Network Info

| Service | Dev Port | Test Port | Prod Port |
|---------|----------|-----------|-----------|
| App     | 3000     | 3001      | 80, 443   |
| MongoDB | 27017    | 27018     | Internal  |

---

## 🆘 Troubleshooting

### Container won't start
```bash
docker logs job_app_prod
# Check logs for error messages
```

### Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database connection failed
```bash
# Check MongoDB is running and healthy
docker-compose ps | grep mongodb

# Check connection string
docker exec job_app_prod env | grep DATABASE_URL

# Test MongoDB directly
docker exec -it job_mongodb_prod mongosh -u admin -p PASSWORD
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old backups
rm backups/*old*
```

---

## 📊 Common Commands by Use Case

### Development Workflow
```bash
# Start
make dev

# View logs while coding
make dev-logs

# Connect to DB
make dev-mongo-shell

# Stop
make dev-stop
```

### Testing Workflow
```bash
make test
make test-logs
make test-stop
```

### Production Deployment
```bash
# Initial setup
docker-setup.sh

# Start
make prod

# Monitor
make prod-logs
make prod-health

# Backup
docker exec job_mongodb_prod mongodump --archive=/backups/backup.archive
```

### Maintenance
```bash
make all-stop              # Stop everything
make all-clean             # Remove everything

docker system prune -a     # Clean up unused resources

docker volume ls           # List volumes
docker volume rm <name>    # Remove volume
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (dev, test, prod) |
| `docker-compose.yml` | Base configuration |
| `docker-compose.develop.yml` | Development overrides |
| `docker-compose.test.yml` | Testing overrides |
| `docker-compose.prod.yml` | Production overrides + nginx |
| `nginx.prod.conf` | Nginx configuration |
| `.env.develop` | Development variables |
| `.env.test` | Testing variables |
| `.env.production` | Production variables |
| `Makefile` | Convenient commands |
| `docker-setup.sh` | Initial VPS setup script |

---

**Last Updated:** 2026-03-06
**Version:** 1.0.0
