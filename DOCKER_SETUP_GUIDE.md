# Docker Compose Multi-Stage Setup Guide

This Docker Compose setup enables running your Next.js application in three different environments: **Development**, **Testing**, and **Production**. It's fully configured for VPS deployment with Nginx reverse proxy, MongoDB database, and proper security configurations.

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Available ports: 3000 (app), 27017 (MongoDB)
- For production: SSL certificates or Let's Encrypt setup

### Install Docker (Ubuntu/Debian)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## 🚀 Quick Start

### 1. Development Environment

Development mode enables hot-reload, includes all debugging tools, and uses direct port mapping.

```bash
# Copy development environment variables
cp .env.develop .env.local

# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.develop.yml up --build

# Access application at http://localhost:3000
```

**Features:**
- Hot-reload enabled
- Volume mounts for live code changes
- Debug port (9230) exposed
- MongoDB exposed on port 27017
- All development dependencies included

### 2. Testing Environment

Testing environment isolates the test database and runs on different ports.

```bash
# Copy test environment variables
cp .env.test .env.local

# Start testing environment
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build

# Access application at http://localhost:3001
# MongoDB runs on port 27018
```

**Features:**
- Isolated test database (job_test_db)
- Separate ports to avoid conflicts
- Ready for CI/CD integration
- Can run parallel to development environment

### 3. Production Environment

Production environment uses Nginx reverse proxy, is VPS-ready, and includes security hardening.

```bash
# Copy production environment variables
cp .env.production .env.local

# IMPORTANT: Edit .env.local with your configuration
nano .env.local

# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs app
```

**Features:**
- Nginx reverse proxy with SSL/TLS support
- Rate limiting and DDoS protection
- Gzip compression enabled
- Static asset caching
- Security headers configured
- Resource limits
- Health checks
- No exposed internal ports

## 📝 Configuration

### Environment Variables

Each environment has its dedicated `.env.{stage}` file:

| Stage | File | Database | Ports |
|-------|------|----------|-------|
| Development | `.env.develop` | job_db | 3000, 27017 |
| Testing | `.env.test` | job_test_db | 3001, 27018 |
| Production | `.env.production` | job_db | 80, 443 (nginx) |

### Key Variables to Update for Production

```env
# 1. Update domain name
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# 2. Generate and set secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# 3. Change database credentials
MONGO_ADMIN_PASSWORD=your_secure_password_here
MONGO_DB_PASSWORD=your_app_db_password_here

# 4. Configure SSL certificates
# Place your SSL certificates in ./ssl directory
# - cert.pem
# - key.pem
```

## 🔐 Production SSL/TLS Setup

### Option 1: Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
sudo chown $USER:$USER ./ssl/*

# Update nginx.prod.conf with certificate paths (already configured)
```

### Option 2: Using Self-Signed Certificates (for testing)

```bash
# Create ssl directory
mkdir -p ssl

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./ssl/key.pem \
  -out ./ssl/cert.pem \
  -subj "/CN=yourdomain.com"
```

## 📊 Docker Commands Reference

### Basic Commands

```bash
# Build and start services
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml up -d

# View running containers
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml ps

# View logs
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml logs app
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml logs mongodb
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml logs nginx

# Follow logs in real-time
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml logs -f

# Stop all services
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml down -v

# Rebuild images
docker-compose -f docker-compose.yml -f docker-compose.{develop|test|prod}.yml up --build
```

### Database Management

```bash
# Connect to MongoDB shell
docker exec -it job_mongodb_dev mongosh -u admin -p admin123

# Backup database
docker exec job_mongodb_prod mongodump --out /data/db/backup

# Restore database
docker exec job_mongodb_prod mongorestore /data/db/backup
```

### Application Management

```bash
# Run npm commands in container
docker exec job_app_prod npm list

# Access app shell
docker exec -it job_app_prod sh

# View Prisma migrations
docker exec job_app_prod npx prisma migrate status
```

## 🔍 Health Checks and Monitoring

### Check Service Health

```bash
# Check health of all services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Test app endpoint
curl -v http://localhost/health

# Test API
curl http://localhost/api/health
```

### View Resource Usage

```bash
# Monitor container resource usage in real-time
docker stats
```

### View Logs

```bash
# App logs only
docker logs -f job_app_prod --tail 100

# Nginx logs
docker logs -f job_nginx_prod --tail 100

# Combined logs
docker-compose logs --follow
```

## 📈 Scaling for Production VPS

### Resource Optimization

1. **Database Optimization:**
   ```bash
   # Enable MongoDB authentication
   # Configure MongoDB backups
   # Set up MongoDB replication if high availability needed
   ```

2. **Application Scaling:**
   - Increase app service replicas in `docker-compose.prod.yml`
   - Use load balancing in Nginx
   - Configure auto-restart policies

3. **Memory and CPU:**
   - Monitor resource limits in `docker-compose.prod.yml`
   - Adjust based on VPS specifications
   - Set up swap if needed

### Backup Strategy

```bash
# Create backup directory
mkdir -p ./backups

# Backup database
docker exec job_mongodb_prod mongodump --archive=/data/db/backup-$(date +%Y%m%d).archive

# Backup .env and ssl files
tar -czf ./backups/config-backup-$(date +%Y%m%d).tar.gz .env.production ./ssl

# Automate with cron
# 0 2 * * * cd /app && docker exec job_mongodb_prod mongodump --archive=/data/db/backup-$(date +\%Y\%m\%d).archive
```

## 🛡️ Security Checklist for Production

- [ ] Change all default passwords in `.env.production`
- [ ] Generate secure `NEXTAUTH_SECRET` using `openssl rand -base64 32`
- [ ] Set up SSL certificates (Let's Encrypt recommended)
- [ ] Configure firewall rules
- [ ] Set up MongoDB backups
- [ ] Enable authentication for MongoDB
- [ ] Review Nginx security headers
- [ ] Set up monitoring and alerts
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Use strong database credentials
- [ ] Disable debug mode in production
- [ ] Set up rate limiting (configured in Nginx)

## 🚨 Troubleshooting

### Container won't start

```bash
# Check logs
docker logs job_app_prod

# Solution: Check environment variables and .env file
# Make sure .env.local exists and has correct values
```

### MongoDB connection refused

```bash
# Check if MongoDB is running and healthy
docker ps | grep mongodb

# Check MongoDB logs
docker logs job_mongodb_prod

# Solution: Wait for MongoDB to start (health check passes)
# Check DATABASE_URL in .env file
```

### Port already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :27017

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml or .env files
```

### SSL Certificate Issues

```bash
# Verify certificate
openssl x509 -in ./ssl/cert.pem -text -noout

# Check certificate validity
openssl x509 -enddate -noout -in ./ssl/cert.pem

# Renew Let's Encrypt certificate
sudo certbot renew
```

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment](https://nextjs.org/docs/deployment/docker)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/other/troubleshooting-orm/engine-not-found)

## 🆘 Support

For issues and questions:
1. Check the logs using `docker-compose logs`
2. Review the troubleshooting section above
3. Verify environment variables are correct
4. Ensure all prerequisites are installed

---

**Created:** 2026-03-06  
**Version:** 1.0.0  
**Last Updated:** 2026-03-06
