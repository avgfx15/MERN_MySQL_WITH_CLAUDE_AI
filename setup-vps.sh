#!/bin/bash

# VPS Initial Setup Script for MERN MySQL App
# Run this script once on your fresh VPS

set -e

echo "========================================="
echo "🖥️  VPS Initial Setup for MERN MySQL App"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${YELLOW}➜ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root or with sudo"
    exit 1
fi

# Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Install Node.js
print_info "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Install MySQL
print_info "Installing MySQL..."
if ! command -v mysql &> /dev/null; then
    apt install mysql-server -y
    print_success "MySQL installed"

    print_info "Securing MySQL installation..."
    mysql_secure_installation
else
    print_success "MySQL already installed"
fi

# Install Nginx
print_info "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installed and started"
else
    print_success "Nginx already installed"
fi

# Install PM2
print_info "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Install Git
print_info "Installing Git..."
if ! command -v git &> /dev/null; then
    apt install git -y
    print_success "Git installed"
else
    print_success "Git already installed"
fi

# Create project directory
print_info "Creating project directory..."
mkdir -p /var/www
print_success "Project directory created"

# Configure UFW Firewall
print_info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    ufw --force enable
    print_success "Firewall configured"
fi

echo ""
echo "========================================="
print_success "Initial VPS setup completed!"
echo "========================================="
echo ""
echo "📋 Next Steps:"
echo "1. Setup MySQL database:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE mern_app_db;"
echo "   CREATE USER 'mern_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "   GRANT ALL PRIVILEGES ON mern_app_db.* TO 'mern_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "2. Clone your GitHub repository:"
echo "   cd /var/www"
echo "   git clone <your-repo-url>"
echo ""
echo "3. Configure environment variables in backend/.env"
echo ""
echo "4. Setup Nginx configuration"
echo ""
echo "5. (Optional) Install SSL certificate:"
echo "   apt install certbot python3-certbot-nginx -y"
echo "   certbot --nginx -d yourdomain.com"
echo ""