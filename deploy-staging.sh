#!/bin/bash

# TaniTrack Staging Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 TaniTrack Staging Deployment"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/tanitrack"
BACKUP_DIR="/var/www/tanitrack-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Step 1: Backup current deployment
echo "📦 Creating backup..."
if [ -d "$PROJECT_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/tanitrack_$TIMESTAMP"
    print_success "Backup created at $BACKUP_DIR/tanitrack_$TIMESTAMP"
else
    print_warning "No existing deployment found, skipping backup"
fi

# Step 2: Pull latest code
echo ""
echo "📥 Pulling latest code..."
cd ~/TaniTrack  # Adjust to your repo location
git pull origin main
print_success "Code updated"

# Step 3: Build backend
echo ""
echo "🔨 Building backend..."
cd backend
npm install
npm run build
print_success "Backend built successfully"

# Step 4: Build frontend
echo ""
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build
print_success "Frontend built successfully"

# Step 5: Deploy backend
echo ""
echo "🚀 Deploying backend..."
mkdir -p "$PROJECT_DIR/backend"
cp -r dist "$PROJECT_DIR/backend/"
cp package.json "$PROJECT_DIR/backend/"
cp package-lock.json "$PROJECT_DIR/backend/"

cd "$PROJECT_DIR/backend"
npm install --production

# Restart backend with PM2
pm2 restart tanitrack-api || pm2 start dist/server.js --name tanitrack-api
print_success "Backend deployed and restarted"

# Step 6: Deploy frontend
echo ""
echo "🌐 Deploying frontend..."
mkdir -p "$PROJECT_DIR/frontend"
cp -r ~/TaniTrack/frontend/dist/* "$PROJECT_DIR/frontend/"
print_success "Frontend deployed"

# Step 7: Restart Nginx
echo ""
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx
print_success "Nginx restarted"

# Step 8: Health check
echo ""
echo "🏥 Running health checks..."
sleep 5  # Wait for services to start

# Check backend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_success "Backend health check passed"
else
    print_error "Backend health check failed"
    echo "Check logs: pm2 logs tanitrack-api"
fi

# Check frontend
if curl -f http://localhost > /dev/null 2>&1; then
    print_success "Frontend health check passed"
else
    print_error "Frontend health check failed"
    echo "Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
fi

# Step 9: Cleanup old backups (keep last 5)
echo ""
echo "🧹 Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t | tail -n +6 | xargs -r rm -rf
print_success "Old backups cleaned"

echo ""
echo "================================"
echo "✨ Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  - Timestamp: $TIMESTAMP"
echo "  - Backend: Running on port 3000"
echo "  - Frontend: Served by Nginx"
echo "  - Backup: $BACKUP_DIR/tanitrack_$TIMESTAMP"
echo ""
echo "🔍 Next steps:"
echo "  1. Test the application at your staging URL"
echo "  2. Check PM2 logs: pm2 logs tanitrack-api"
echo "  3. Monitor Nginx logs: sudo tail -f /var/log/nginx/access.log"
echo ""
echo "🆘 If issues occur, rollback with:"
echo "  cp -r $BACKUP_DIR/tanitrack_$TIMESTAMP/* $PROJECT_DIR/"
echo "  pm2 restart tanitrack-api"
echo "  sudo systemctl restart nginx"
echo ""
