#!/bin/bash
# Build script for cPanel deployment (Linux/Mac)
# This builds the app locally and prepares it for upload to cPanel

set -e

echo "=== Building Kevin Cab for cPanel Deployment ==="

# Step 1: Clean previous builds
echo ""
echo "Step 1: Cleaning previous builds..."
rm -rf .next node_modules
echo "✓ Cleaned previous builds"

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Step 3: Build the application
echo ""
echo "Step 3: Building Next.js application..."
npm run build
echo "✓ Build completed successfully"

# Step 4: Create deployment package
echo ""
echo "Step 4: Creating deployment package..."
DEPLOY_DIR="deploy-package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy necessary files
echo "Copying files..."
cp -r .next "$DEPLOY_DIR/.next"
cp -r public "$DEPLOY_DIR/public"
cp -r app "$DEPLOY_DIR/app"
cp -r components "$DEPLOY_DIR/components"
cp -r lib "$DEPLOY_DIR/lib"
cp -r database "$DEPLOY_DIR/database"
cp -r scripts "$DEPLOY_DIR/scripts"
cp package.json "$DEPLOY_DIR/package.json"
cp next.config.mjs "$DEPLOY_DIR/next.config.mjs"
cp server.js "$DEPLOY_DIR/server.js"
cp middleware.js "$DEPLOY_DIR/middleware.js"
cp .gitignore "$DEPLOY_DIR/.gitignore"

# Copy optional files if they exist
[ -f ecosystem.config.js ] && cp ecosystem.config.js "$DEPLOY_DIR/ecosystem.config.js"
[ -f .htaccess ] && cp .htaccess "$DEPLOY_DIR/.htaccess"
[ -f .cpanel.yml ] && cp .cpanel.yml "$DEPLOY_DIR/.cpanel.yml"

echo "✓ Deployment package created in '$DEPLOY_DIR' directory"

# Step 5: Create deployment instructions
cat > "$DEPLOY_DIR/DEPLOY-INSTRUCTIONS.txt" << 'EOF'
=== DEPLOYMENT INSTRUCTIONS ===

1. Upload the contents of the 'deploy-package' folder to your cPanel server
   - You can use FTP, SFTP, or cPanel File Manager
   - Upload to: ~/kevin-cab/ (or your application directory)

2. SSH into your cPanel server and run:
   cd ~/kevin-cab
   npm run deploy:install
   npm run db:init
   npm run deploy:start

3. Configure Node.js App in cPanel:
   - Application Root: /home/yourusername/kevin-cab
   - Application Startup File: server.js
   - Node.js Version: 20.11.0 or higher
   
4. Set Environment Variables in cPanel:
   DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=https://yourdomain.com
   NODE_ENV=production

5. Start/Restart the application via cPanel Node.js interface

=== ALTERNATIVE: Use Git ===

If you prefer Git deployment:
1. Commit the built files:
   git add deploy-package
   git commit -m "Add pre-built files for cPanel"
   git push

2. On cPanel server:
   cd ~/kevin-cab
   git pull
   cp -r deploy-package/* .
   npm run deploy:install
   npm run db:init
   npm run deploy:start

EOF

echo ""
echo "=== BUILD COMPLETE ==="
echo "Deployment package ready in: $DEPLOY_DIR"
echo "See $DEPLOY_DIR/DEPLOY-INSTRUCTIONS.txt for upload instructions"
echo ""
echo "Next steps:"
echo "1. Upload '$DEPLOY_DIR' contents to your cPanel server"
echo "2. Run 'npm run deploy:install' on the server"
echo "3. Run 'npm run db:init' to initialize database"
echo "4. Start the app with 'npm run deploy:start'"
