#!/bin/bash

# MERN MySQL App Deployment Script
# This script automates the deployment process on VPS

set -e  # Exit on any error

echo "========================================="
echo "🚀 MERN MySQL App Deployment"
echo "========================================="
echo ""

# Configuration
PROJECT_DIR="/var/www/mern-mysql-app"
BRANCH="main"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run with sudo or as root"
    exit 1
fi

# Navigate to project directory
print_info "Navigating to project directory..."
cd "$PROJECT_DIR" || {
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
}
print_success "In project directory"

# Git pull latest changes
print_info "Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/$BRANCH
git pull origin $BRANCH
print_success "Code updated from GitHub"

# Backend deployment
print_info "Deploying backend..."
cd backend

print_info "Installing backend dependencies..."
npm install --production
print_success "Backend dependencies installed"

print_info "Restarting backend with PM2..."
if pm2 describe mern-backend > /dev/null 2>&1; then
    pm2 restart mern-backend
    print_success "Backend restarted"
else
    pm2 start server.js --name mern-backend
    pm2 save
    print_success "Backend started"
fi

# Frontend deployment
print_info "Deploying frontend..."
cd ../frontend

print_info "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

print_info "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Restart Nginx
print_info "Restarting Nginx..."
systemctl restart nginx
print_success "Nginx restarted"

# Show status
echo ""
echo "========================================="
echo "📊 Deployment Status"
echo "========================================="
pm2 status
echo ""

# Check services
print_info "Checking services..."
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
fi

echo ""
echo "========================================="
print_success "Deployment completed successfully!"
echo "========================================="
echo ""
echo "🌐 Your app should now be live!"
echo "📝 Check logs with: pm2 logs mern-backend"
echo "🔍 Monitor with: pm2 monit"
echo ""