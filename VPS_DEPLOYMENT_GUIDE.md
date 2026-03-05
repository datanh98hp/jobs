# VPS Production Deployment Guide

This guide provides step-by-step instructions for deploying the Next.js application to a VPS using Docker Compose.

## 🖥️ Prerequisites

- A VPS with at least:
  - 2 GB RAM
  - 2 vCPU cores
  - 20 GB storage
  - Ubuntu 20.04 LTS or newer
- Root or sudo access to the VPS
- Domain name pointing to your VPS IP
- SSH access to the VPS

## 📋 Initial VPS Setup

### 1. Connect to Your VPS

```bash
ssh root@your_vps_ip
# or if using a specific key
ssh -i /path/to/key.pem root@your_vps_ip
```

### 2. Update System

```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git nano
```

### 3. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Apply group membership
newgrp docker
```

### 4. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### 5. Install Certbot (for SSL certificates)

```bash
sudo apt-get install -y certbot python3-certbot-nginx

# Or for Nginx only (recommended)
sudo apt-get install -y certbot
```

### 6. Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (IMPORTANT! Do this first)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verify rules
sudo ufw status
```

## 🚀 Deploy Your Application

### 1. Clone Repository or Upload Files

```bash
# Option A: Clone from Git
git clone your_repo_url /var/www/job
cd /var/www/job

# Option B: Create project directory
mkdir -p /var/www/job
cd /var/www/job
# Upload your files here via SCP or other means
```

### 2. Setup Environment Variables

```bash
# Copy production env file
cp .env.production .env.local

# Edit with your configuration
nano .env.local
```

### Configuration Details

Update these critical variables in `.env.local`:

```env
# Domain configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Generate secure secret
NEXTAUTH_SECRET=<generate_with_openssl_rand_-base64_32>

# Database credentials (CHANGE THESE!)
MONGO_ADMIN_PASSWORD=<generate_strong_password>
MONGO_DB_PASSWORD=<generate_another_strong_password>
```

### 3. Generate SSL Certificate

#### Option A: Let's Encrypt (Recommended)

```bash
# Stop any running services first
docker-compose down

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Create ssl directory
mkdir -p ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem

# Fix permissions
sudo chown $USER:$USER ./ssl/*
chmod 644 ./ssl/cert.pem
chmod 600 ./ssl/key.pem

# Auto-renewal with cron (Let's Encrypt certs expire in 90 days)
# Add to crontab: sudo crontab -e
# 0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/www/job/ssl/cert.pem && cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/www/job/ssl/key.pem
```

#### Option B: Self-Signed Certificate (Testing Only)

```bash
mkdir -p ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./ssl/key.pem \
  -out ./ssl/cert.pem \
  -subj "/CN=yourdomain.com"

chmod 644 ./ssl/cert.pem
chmod 600 ./ssl/key.pem
```

### 4. Build and Start Services

```bash
# Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start services in background
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

### 5. Verify Deployment

```bash
# Test HTTP redirect to HTTPS
curl -i http://yourdomain.com

# Test HTTPS
curl -i https://yourdomain.com

# Check application health
curl -i https://yourdomain.com/health

# Check API
curl -i https://yourdomain.com/api/health
```

## 📊 Ongoing Management

### Daily Operations

```bash
# Check service status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# View recent logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail 50 app

# Monitor resource usage
docker stats
```

### Backup Strategy

#### Automated Daily Backups

```bash
# Create backup script: backup.sh
#!/bin/bash
BACKUP_DIR="/var/www/job/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker exec job_mongodb_prod mongodump --archive=/data/db/backup-$DATE.archive --gzip

# Backup configuration
tar -czf $BACKUP_DIR/config-$DATE.tar.gz /var/www/job/.env.local /var/www/job/ssl

# Keep only last 7 days
find $BACKUP_DIR -name "backup-*.archive" -mtime +7 -delete

echo "Backup completed: $DATE"

# Make script executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
# crontab -e
# 0 2 * * * cd /var/www/job && ./backup.sh
```

#### Manual Backup

```bash
# Backup database
docker exec job_mongodb_prod mongodump --archive=/backups/manual-backup-$(date +%Y%m%d).archive

# Backup configuration
tar -czf /backups/config-backup-$(date +%Y%m%d).tar.gz .env.local ssl/

# Download backups locally (from your local machine)
# scp -r root@yourvps:/var/www/job/backups ~/local-backups/
```

### Updates and Maintenance

```bash
# Update application (with downtime minimized)
git pull origin main

# Rebuild images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View new logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f app
```

### Database Management

```bash
# Connect to MongoDB
docker exec -it job_mongodb_prod mongosh -u admin -p <password>

# Backup database
docker exec job_mongodb_prod mongodump --out /data/db/backup

# Monitor database size
docker exec job_mongodb_prod du -sh /data/db
```

## 🔐 Security Hardening

### 1. SSH Security

```bash
# Disable root login via SSH
sudo nano /etc/ssh/sshd_config

# Change these lines:
# PasswordAuthentication no
# PermitRootLogin no
# AllowUsers yourusername

# Restart SSH
sudo systemctl restart sshd
```

### 2. Fail2Ban (Brute Force Protection)

```bash
# Install Fail2Ban
sudo apt-get install -y fail2ban

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### 3. Automated Security Updates

```bash
# Install unattended-upgrades
sudo apt-get install -y unattended-upgrades

# Enable it
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 🚨 Troubleshooting

### Application not starting

```bash
# Check logs
docker logs job_app_prod

# Verify environment variables
docker exec job_app_prod env | grep DATABASE_URL

# Check database connection
docker logs job_mongodb_prod
```

### High memory usage

```bash
# Check container stats
docker stats

# Limit resources in docker-compose.prod.yml
# Add deploy section to services

# Restart to apply limits
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### SSL Certificate issues

```bash
# Check certificate expiration
openssl x509 -enddate -noout -in ./ssl/cert.pem

# Test SSL
openssl s_client -connect yourdomain.com:443

# Renew Let's Encrypt (should be automatic)
sudo certbot renew --dry-run
```

### Port already in use

```bash
# Find what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Kill process
sudo kill -9 <PID>
```

## 📈 Performance Optimization

### 1. Increase Limits for Large Datasets

```bash
# In docker-compose.prod.yml, increase MongoDB memory:
deploy:
  resources:
    limits:
      memory: 4G
    reservations:
      memory: 2G
```

### 2. Enable Nginx Caching

Already configured in `nginx.prod.conf` with:
- Gzip compression
- Static asset caching (30 days)
- Proxy caching
- Rate limiting

### 3. Database Indexing

```bash
# Connect to MongoDB and add indexes for frequently queried fields
docker exec -it job_mongodb_prod mongosh -u admin -p <password>

# Example index creation
db.getDatabase('job_db')
db.employees.createIndex({ "email": 1 })
db.products.createIndex({ "categoryId": 1 })
```

## 📞 Monitoring and Alerts

### Setup Simple Uptime Monitoring

```bash
# Create health check script
#!/bin/bash
DOMAIN="yourdomain.com"
MAIL="admin@yourdomain.com"

if ! curl -sf https://$DOMAIN/health > /dev/null 2>&1; then
    echo "Alert: $DOMAIN is down!" | mail -s "App Down Alert" $MAIL
    # Restart services
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart app
fi
```

### View System Metrics

```bash
# CPU and Memory
free -h
top

# Disk usage
df -h

# Network
netstat -tuln | grep LISTEN
```

## 🎯 Performance Checklist

- [ ] SSL certificate installed and auto-renewal configured
- [ ] Firewall configured (UFW or similar)
- [ ] Swap memory configured
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] DB credentials changed from defaults
- [ ] NEXTAUTH_SECRET generated securely
- [ ] Rate limiting active (Nginx configured)
- [ ] Gzip compression enabled
- [ ] Docker container restart policies set
- [ ] Log rotation configured
- [ ] Fail2Ban or equivalent installed

## 📚 Useful Commands

```bash
# System info
docker version
docker system df
docker image ls
docker volume ls

# Container management
docker ps -a
docker container prune
docker image prune

# Logs and debugging
docker logs <container_id>
docker exec -it <container_id> bash

# Network
docker network ls
docker network inspect job-network

# Resource cleanup
docker system prune -a
```

## ⚠️ Important Notes

1. **Always test certificate renewal** before going live on auto-renewal
2. **Keep backups off-site** in case of server compromise
3. **Monitor disk space** - databases grow over time
4. **Set up alerts** for errors and downtime
5. **Document all changes** you make for future reference
6. **Test recovery procedures** periodically

## 🆘 Getting Help

- Check Docker logs: `docker-compose logs`
- Review Nginx error: `docker logs job_nginx_prod`
- Check application logs: `docker logs job_app_prod`
- Read Docker documentation: https://docs.docker.com/
- Check Next.js deployment guide: https://nextjs.org/docs/deployment/docker

---

**Created:** 2026-03-06  
**Last Updated:** 2026-03-06
