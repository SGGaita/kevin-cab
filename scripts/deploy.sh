#!/bin/bash

# Kevincab cPanel Deployment Script
# This script automates the deployment process on cPanel

set -e

echo "🚀 Starting Kevincab deployment..."

# Configuration
APP_DIR="/home/username/kevincab"
NODE_VERSION="20.11.0"

# Navigate to application directory
cd $APP_DIR

echo "📦 Installing dependencies..."
npm install --production

echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Deployment complete!"
echo "🌐 Application ready at your configured domain"
echo ""
echo "Next steps:"
echo "1. Restart the Node.js application in cPanel"
echo "2. Check application logs for any errors"
echo "3. Visit your domain to verify deployment"
