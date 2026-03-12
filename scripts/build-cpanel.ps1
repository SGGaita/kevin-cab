# Build script for cPanel deployment (Windows PowerShell)
# This builds the app locally and prepares it for upload to cPanel

Write-Host "=== Building Kevin Cab for cPanel Deployment ===" -ForegroundColor Green

# Step 1: Clean previous builds
Write-Host ""
Write-Host "Step 1: Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Removed .next directory" -ForegroundColor Green
}
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "Removed node_modules directory" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed" -ForegroundColor Green

# Step 3: Build the application
Write-Host ""
Write-Host "Step 3: Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed successfully" -ForegroundColor Green

# Step 4: Create deployment package
Write-Host ""
Write-Host "Step 4: Creating deployment package..." -ForegroundColor Yellow
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

Write-Host "Deployment package created" -ForegroundColor Green

# Step 5: Create deployment instructions
$instructionText = "DEPLOYMENT INSTRUCTIONS`n`n"
$instructionText += "1. Upload deploy-package contents to cPanel server`n"
$instructionText += "2. SSH into server and run: npm run deploy:install`n"
$instructionText += "3. Initialize database: npm run db:init`n"
$instructionText += "4. Start application: npm run deploy:start`n"

$instructionText | Out-File -FilePath "$deployDir/DEPLOY-INSTRUCTIONS.txt" -Encoding UTF8

Write-Host ""
Write-Host "=== BUILD COMPLETE ===" -ForegroundColor Green
Write-Host "Package location: $deployDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload deploy-package folder to cPanel" -ForegroundColor White
Write-Host "2. SSH and run: npm run deploy:install" -ForegroundColor White
Write-Host "3. Initialize DB: npm run db:init" -ForegroundColor White
Write-Host "4. Start app: npm run deploy:start" -ForegroundColor White
