# Job Management Application

A modern Next.js application for managing employees, products, and categories with authentication. This project supports both local development with cloud MongoDB and Docker containerization.

## 📋 Table of Contents

- [Project Features](#-project-features)
- [Prerequisites](#-prerequisites)
- [Local Development with Cloud MongoDB](#-local-development-with-cloud-mongodb)
- [Docker Setup](#-docker-setup)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Architecture](#-architecture)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Project Features

- 🔐 **Authentication** - NextAuth.js integration with MongoDB
- 👥 **Employee Management** - CRUD operations for employees
- 📦 **Product Management** - Manage products with categories
- 📊 **Dashboard** - Analytics and data visualization
- 🎨 **Dark Mode** - Theme switching support
- 📱 **Responsive Design** - Mobile-friendly UI
- 🚀 **Next.js 16** - Latest React framework with TypeScript
- 💾 **MongoDB** - Flexible database with Prisma ORM

---

## 📦 Prerequisites

### For Local Development
- **Node.js** 20+ (Download from https://nodejs.org/)
- **npm** (comes with Node.js)
- **Internet** (to connect to cloud MongoDB)

### For Docker
- **Docker** 20.10+ (Download from https://www.docker.com/)
- **Docker Compose** 2.0+ (Included with Docker Desktop)

### Optional
- **Git** - For version control
- **OpenSSL** - For generating secure secrets

---

## 🚀 Local Development with Cloud MongoDB

This option allows you to run the application locally while using MongoDB Atlas (cloud) for the database.

### Step 1: Setup MongoDB Atlas Account

1. Go to https://www.mongodb.com/atlas/
2. Create a free account (or sign in)
3. Create a new project
4. Create a cluster

### Step 2: Get MongoDB Connection String

1. Go to your cluster → **Connect**
2. Choose **Drivers** → **Node.js**
3. You should see a connection string like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?appName=Cluster0
   ```

**Example Connection String** (with test credentials):
```
mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0
```

### Step 3: Create Environment File

Create a `.env.local` file in the project root:

```bash
# If on Linux/Mac:
cat > .env.local << 'EOF'
# Application
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this

# Cloud MongoDB URL (replace with your actual URL)
DATABASE_URL=mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0

# Optional: NextAuth Configuration
NEXTAUTH_PROVIDERS=credentials
EOF
```

**Or on Windows (PowerShell):**

```powershell
# Create .env.local with content
@"
# Application
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this

# Cloud MongoDB URL
DATABASE_URL=mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0
"@ | Out-File -Encoding UTF8 .env.local
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Setup Prisma (Database Schema)

```bash
# Generate Prisma client with your MongoDB
npx prisma generate

# Optional: Seed database with initial data
npx prisma db seed
```

### Step 6: Run the Application

```bash
# Development mode with hot-reload
npm run dev

# The app will open at http://localhost:3000
```

### Environment Variables for Local Development

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3000` | Local port (optional, defaults to 3000) |
| `DATABASE_URL` | `mongodb+srv://...` | **Cloud MongoDB connection string** |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | App public URL |
| `NEXTAUTH_URL` | `http://localhost:3000` | Auth callback URL |
| `NEXTAUTH_SECRET` | `random-secret-key` | Session encryption secret (use `openssl rand -base64 32`) |

### Sample .env.local for Cloud MongoDB

```dotenv
# Application Settings
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Generate a secret
NEXTAUTH_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Cloud MongoDB Connection (from MongoDB Atlas)
DATABASE_URL=mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0

# Debug Mode (optional)
DEBUG=true
```

### Troubleshooting Local Development

**Issue: "Cannot connect to MongoDB"**
```bash
# 1. Verify your connection string
cat .env.local | grep DATABASE_URL

# 2. Check if MongoDB Atlas cluster is active (go to MongoDB Atlas console)

# 3. Verify network access (whitelist your IP in MongoDB Atlas)
# - Go to Security → Network Access
# - Add your current IP or 0.0.0.0/0 (for development only)
```

**Issue: "Prisma client not generated"**
```bash
npx prisma generate
npm run dev
```

**Issue: "Port 3000 already in use"**
```bash
# On Linux/Mac:
lsof -i :3000
kill -9 <PID>

# Or use a different port:
PORT=3001 npm run dev
```

---

## 🐳 Docker Setup

Docker allows you to run the entire application (Next.js + MongoDB) in isolated containers.

### Option 1: Local Development with Docker (Hot-Reload)

This runs the app in development mode with hot-reload inside Docker.

```bash
# 1. Copy development environment file
cp .env.develop .env.local

# 2. Start development environment
docker-compose -f docker-compose.yml -f docker-compose.develop.yml up

# 3. Access at http://localhost:3000
```

**What's included:**
- Next.js app with hot-reload
- Local MongoDB database
- Node debugger port (9230)

**Stop the services:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.develop.yml down
```

### Option 2: Testing with Docker (Isolated)

Runs testing environment with separate database and ports.

```bash
# Start testing environment
docker-compose -f docker-compose.yml -f docker-compose.test.yml up

# Access at http://localhost:3001
# MongoDB on port 27018
```

### Option 3: Production with Docker (Nginx + SSL)

Runs production setup with Nginx reverse proxy.

```bash
# 1. Copy production environment
cp .env.production .env.local

# 2. Edit configuration
nano .env.local

# 3. Start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. Access at http://localhost or https://yourdomain.com
```

---

## 🔧 Environment Variables

### For Docker with Local MongoDB

Create `.env.local` or use environment files:

```dotenv
# Docker compose file selection
NODE_ENV=development
ENVIRONMENT=develop
DOCKER_BUILD_TARGET=development

# Application
PORT=3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Local MongoDB (running in Docker)
MONGO_ADMIN_USER=admin
MONGO_ADMIN_PASSWORD=admin123
MONGO_DB_NAME=job_db
MONGO_DB_USER=job_user
MONGO_DB_PASSWORD=job_password
MONGO_PORT=27017

# Services
APP_PORT=3000

# Debug
DEBUG=true
```

### For Docker with Cloud MongoDB

Edit docker-compose.yml to use cloud MongoDB:

```bash
docker-compose -f docker-compose.yml \
  -e DATABASE_URL="mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0" \
  up
```

Or edit the docker-compose.yml directly and remove the local MongoDB service.

### Environment Variable Reference

**Application Variables:**
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment (development/test/production) |
| `PORT` | `3000` | Application port |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Public URL for client-side |
| `NEXTAUTH_URL` | `http://localhost:3000` | Auth callback URL |
| `NEXTAUTH_SECRET` | - | **Required** - Session encryption secret |

**Database Variables:**
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | - | MongoDB connection string (local or cloud) |
| `MONGO_DB_NAME` | `job_db` | Database name |

---

## 🛠️ Available Scripts

### Local Development Scripts

```bash
# Start development server (with hot-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Docker Commands Using Makefile

If you have `make` installed:

```bash
# Development
make dev                # Start dev environment
make dev-logs          # View logs
make dev-mongo-shell   # Connect to MongoDB

# Testing
make test              # Start test environment
make test-logs         # View logs

# Production
make prod              # Start prod environment
make prod-logs         # View logs

# Utilities
make all-stop          # Stop all services
make ps               # Show running containers
make health           # Check service health
make help             # Show all commands
```

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (DELETE DATA!)
docker-compose down -v

# List running containers
docker-compose ps
```

---

## 🏗️ Architecture

### Project Structure

```
job/
├── app/                          # Next.js application
│   ├── (admin)/                  # Admin routes
│   ├── (client)/                 # Client routes
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/                   # React components
│   ├── ui/                       # UI components (Radix)
│   ├── contents/                 # Content components
│   └── providers/                # Context providers
├── lib/                          # Utilities
│   ├── api.ts
│   ├── auth_action.ts
│   ├── authOptions.ts
│   └── prisma.ts                 # Prisma client
├── prisma/
│   └── schema.prisma             # Database schema
├── Dockerfile                     # Multi-stage build
├── docker-compose.yml             # Base Docker config
├── docker-compose.develop.yml     # Dev overrides
├── docker-compose.prod.yml        # Production overrides
├── .env.local                     # Your local env (not committed)
└── package.json
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB
- **Authentication**: NextAuth.js with MongoDB adapter
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx (production)

---

## 🗂️ Configuration Files

### .env Files

| File | Purpose | Used In |
|------|---------|---------|
| `.env.develop` | Development environment | Local dev with Docker |
| `.env.test` | Testing environment | Docker testing |
| `.env.production` | Production environment | Docker production |
| `.env.local` | Your local overrides | Not committed to git |

Always use `.env.local` for local development. Don't commit it to git.

### Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Base configuration (shared) |
| `docker-compose.develop.yml` | Development overrides (hot-reload) |
| `docker-compose.test.yml` | Testing overrides (isolated) |
| `docker-compose.prod.yml` | Production overrides (Nginx, SSL) |

---

## 🚨 Troubleshooting

### Local Development Issues

**"Cannot find module '@prisma/client'"**
```bash
npm install
npx prisma generate
```

**"DATABASE_URL is required"**
```bash
# Make sure .env.local exists with DATABASE_URL
cat .env.local | grep DATABASE_URL

# If empty, add it:
echo "DATABASE_URL=mongodb+srv://your_url" >> .env.local
```

**"Failed to connect to MongoDB"**
```bash
# 1. Check your connection string
echo $DATABASE_URL

# 2. If using MongoDB Atlas, whitelist your IP:
#    Go to MongoDB Atlas → Security → Network Access
#    Add your IP (or 0.0.0.0/0 for testing)

# 3. Test connection to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net"
```

### Docker Issues

**"Cannot connect to Docker daemon"**
```bash
# Make sure Docker is running
docker --version

# On Windows: Start Docker Desktop
# On Mac: Start Docker Desktop
# On Linux: sudo systemctl start docker
```

**"Port 3000 already in use"**
```bash
# Change port in .env.local
PORT=3001 npm run dev

# Or kill the process
lsof -i :3000
kill -9 <PID>
```

**"MongoDB connection refused"**
```bash
# Check if MongoDB container is running
docker ps | grep mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart services
docker-compose down
docker-compose up
```

**"Cannot build image"**
```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Additional Documentation

For more detailed information, check these files:

- **[DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md)** - Complete Docker setup guide
- **[DOCKER_QUICK_REFERENCE.md](DOCKER_QUICK_REFERENCE.md)** - Quick command cheat sheet
- **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** - Production VPS deployment
- **[DOCKER_SETUP_SUMMARY.md](DOCKER_SETUP_SUMMARY.md)** - Overview of Docker files

---

## 🔐 Security Notes

### For Development
- Use safe default passwords (they're not exposed)
- Keep `.env.local` out of git (add to `.gitignore`)
- Don't commit actual secrets to repository

### For Production
- Generate strong NEXTAUTH_SECRET: `openssl rand -base64 32`
- Use strong MongoDB credentials
- Enable SSL/TLS certificates
- Whitelist specific IPs in MongoDB Atlas
- Never commit `.env.production` to git

### Getting Help with MongoDB Atlas

1. **Connection String Issues**: Go to MongoDB Atlas → Connect → Copy connection string
2. **Authentication Errors**: Check credentials and database name
3. **Network Access**: Go to Security → Network Access → Add IP address
4. **IP Whitelist**: Add 0.0.0.0/0 for development, specific IPs for production

---

## 📖 Quick Reference

### Start Development Quickly

```bash
# Option 1: Local with Cloud MongoDB
echo "DATABASE_URL=mongodb+srv://auth_acc:rfMN6pgOOJphZi0U@cluster0.dxswz.mongodb.net/job?appName=Cluster0" > .env.local
npm install
npm run dev

# Option 2: Docker with Local MongoDB
docker-compose -f docker-compose.yml -f docker-compose.develop.yml up
```

### Common Commands

```bash
# Local development
npm run dev           # Start with hot-reload

# Docker development
docker-compose up     # Start all services
docker-compose logs   # View logs
docker-compose ps     # List containers

# Database
npx prisma generate   # Update Prisma client
npx prisma db push    # Sync schema to DB

# Cleanup
docker-compose down   # Stop services
docker system prune    # Clean up Docker
```

---

## 🎯 Next Steps

1. **Choose your setup:**
   - [Local Development](#-local-development-with-cloud-mongodb) - If you want to code locally
   - [Docker Development](#-docker-setup) - If you want containerization

2. **Install dependencies** and start development

3. **Create `.env.local`** with your MongoDB connection string

4. **Read** the relevant documentation for your setup

5. **Start building!** 🚀

---

## 📝 License

This project is private and confidential.

---

**Last Updated**: March 6, 2026  
**Version**: 1.0.0  
**Node.js**: 20+  
**Next.js**: 16.1.1
