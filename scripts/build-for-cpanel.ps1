# Build script for cPanel deployment (Windows PowerShell)
# This builds the app locally and prepares it for upload to cPanel

Write-Host "=== Building Kevin Cab for cPanel Deployment ===" -ForegroundColor Green

# Step 1: Clean previous builds
Write-Host "`nStep 1: Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Removed .next directory" -ForegroundColor Green
}
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules directory" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "`nStep 2: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Step 3: Build the application
Write-Host "`nStep 3: Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build completed successfully" -ForegroundColor Green

# Step 4: Create deployment package
Write-Host "`nStep 4: Creating deployment package..." -ForegroundColor Yellow
$deployDir = "deploy-package"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy necessary files
Write-Host "Copying files..." -ForegroundColor Cyan
Copy-Item -Recurse ".next" "$deployDir/.next"
Copy-Item -Recurse "public" "$deployDir/public"
Copy-Item -Recurse "app" "$deployDir/app"
Copy-Item -Recurse "components" "$deployDir/components"
Copy-Item -Recurse "lib" "$deployDir/lib"
Copy-Item -Recurse "database" "$deployDir/database"
Copy-Item -Recurse "scripts" "$deployDir/scripts"
Copy-Item "package.json" "$deployDir/package.json"
Copy-Item "next.config.mjs" "$deployDir/next.config.mjs"
Copy-Item "server.js" "$deployDir/server.js"
Copy-Item "middleware.js" "$deployDir/middleware.js"
Copy-Item ".gitignore" "$deployDir/.gitignore"

# Copy optional files if they exist
if (Test-Path "ecosystem.config.js") {
    Copy-Item "ecosystem.config.js" "$deployDir/ecosystem.config.js"
}
if (Test-Path ".htaccess") {
    Copy-Item ".htaccess" "$deployDir/.htaccess"
}
if (Test-Path ".cpanel.yml") {
    Copy-Item ".cpanel.yml" "$deployDir/.cpanel.yml"
}

Write-Host "✓ Deployment package created in '$deployDir' directory" -ForegroundColor Green

# Step 5: Create deployment instructions
$instructions = @'
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

'@

$instructions | Out-File -FilePath "$deployDir/DEPLOY-INSTRUCTIONS.txt" -Encoding UTF8

Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Green
Write-Host "Deployment package ready in: $deployDir" -ForegroundColor Cyan
Write-Host "See $deployDir/DEPLOY-INSTRUCTIONS.txt for upload instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload deploy-package contents to your cPanel server" -ForegroundColor White
Write-Host "2. Run npm run deploy:install on the server" -ForegroundColor White
Write-Host "3. Run npm run db:init to initialize database" -ForegroundColor White
Write-Host "4. Start the app with npm run deploy:start" -ForegroundColor White
