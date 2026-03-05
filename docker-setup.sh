#!/bin/bash

###############################################################################
# Docker Deployment Setup Script for VPS
# This script automates the initial setup for deploying on a VPS
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="job"
DOCKER_COMPOSE_VERSION="2.0.0"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Docker Deployment Setup for VPS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running on appropriate OS
check_os() {
    echo -e "${BLUE}[1/5] Checking OS compatibility...${NC}"
    
    OS=$(uname -s)
    if [[ ! "$OS" =~ ^(Linux|Darwin)$ ]]; then
        echo -e "${RED}Error: This script only works on Linux or macOS${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ OS: $OS detected${NC}"
}

# Check Docker installation
check_docker() {
    echo -e "${BLUE}[2/5] Checking Docker installation...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed${NC}"
        echo "Install Docker with: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi
    
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✓ Docker version: $DOCKER_VERSION${NC}"
}

# Check Docker Compose installation
check_docker_compose() {
    echo -e "${BLUE}[3/5] Checking Docker Compose installation...${NC}"
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed${NC}"
        echo "Install with: sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m) -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose"
        exit 1
    fi
    
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✓ Docker Compose version: $COMPOSE_VERSION${NC}"
}

# Setup environment files
setup_env_files() {
    echo -e "${BLUE}[4/5] Setting up environment files...${NC}"
    
    # Check if production env file exists
    if [ ! -f ".env.production" ]; then
        echo -e "${YELLOW}Warning: .env.production not found${NC}"
    else
        echo -e "${GREEN}✓ .env.production found${NC}"
    fi
    
    # Create .env symlink if not exists
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}Creating .env.local from .env.production${NC}"
        cp .env.production .env.local
        echo -e "${GREEN}✓ .env.local created${NC}"
    fi
}

# Create necessary directories
setup_directories() {
    echo -e "${BLUE}[5/5] Creating required directories...${NC}"
    
    mkdir -p ssl
    mkdir -p backups
    mkdir -p logs
    mkdir -p data/mongodb
    
    echo -e "${GREEN}✓ Directories created:${NC}"
    echo "  - ssl/ (for SSL certificates)"
    echo "  - backups/ (for database backups)"
    echo "  - logs/ (for application logs)"
    echo "  - data/mongodb/ (for database storage)"
}

# Summary
show_summary() {
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Setup Completed Successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo ""
    echo "1. Edit .env.local with your production configuration:"
    echo "   ${YELLOW}nano .env.local${NC}"
    echo ""
    echo "2. Generate NEXTAUTH_SECRET:"
    echo "   ${YELLOW}openssl rand -base64 32${NC}"
    echo ""
    echo "3. Setup SSL certificates (choose one):"
    echo "   a) Let's Encrypt: sudo certbot certonly --standalone -d yourdomain.com"
    echo "   b) Self-signed: openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/key.pem -out ./ssl/cert.pem"
    echo ""
    echo "4. Start production environment:"
    echo "   ${YELLOW}docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d${NC}"
    echo ""
    echo "5. Or use Makefile commands:"
    echo "   ${YELLOW}make prod      # Start production${NC}"
    echo "   ${YELLOW}make prod-logs # View logs${NC}"
    echo "   ${YELLOW}make help      # See all commands${NC}"
    echo ""
    echo -e "${BLUE}Documentation:${NC}"
    echo "   See DOCKER_SETUP_GUIDE.md for detailed instructions"
    echo ""
}

# Main execution
main() {
    check_os
    check_docker
    check_docker_compose
    setup_env_files
    setup_directories
    show_summary
}

# Run main function
main

exit 0
