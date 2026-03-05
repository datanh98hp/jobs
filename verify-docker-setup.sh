#!/bin/bash

# Docker Setup Verification Script
# This script verifies all Docker files are in place

echo "🔍 Checking Docker Setup Files..."
echo "================================="
echo ""

FILES_REQUIRED=(
    "Dockerfile"
    "docker-compose.yml"
    "docker-compose.develop.yml"
    "docker-compose.test.yml"
    "docker-compose.prod.yml"
    "nginx.prod.conf"
    ".env.develop"
    ".env.test"
    ".env.production"
    ".dockerignore"
    "init-mongo.sh"
    "Makefile"
    "docker-setup.sh"
    "DOCKER_SETUP_GUIDE.md"
    "VPS_DEPLOYMENT_GUIDE.md"
    "DOCKER_QUICK_REFERENCE.md"
    "DOCKER_SETUP_SUMMARY.md"
    ".github/workflows/deploy.yml"
    ".github/workflows/test.yml"
)

MISSING=0
FOUND=0

for file in "${FILES_REQUIRED[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
        ((FOUND++))
    else
        echo "❌ $file (MISSING)"
        ((MISSING++))
    fi
done

echo ""
echo "================================="
echo "Summary: $FOUND found, $MISSING missing"
echo "================================="
echo ""

if [ $MISSING -eq 0 ]; then
    echo "✨ All Docker files are in place!"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Read DOCKER_SETUP_SUMMARY.md for overview"
    echo "   2. Run: make dev (for development)"
    echo "   3. Or: chmod +x docker-setup.sh && ./docker-setup.sh (for VPS)"
    exit 0
else
    echo "⚠️  Some files are missing. Please check path and permissions."
    exit 1
fi
