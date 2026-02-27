const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');

// Generate a secure random secret
const generateSecret = () => crypto.randomBytes(32).toString('base64');

// Environment file template
const createEnvContent = (environment = 'development') => {
  const secret = generateSecret();
  const url = environment === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000';
  
  const dbName = environment === 'production' 
    ? 'kevincab' 
    : `kevincab_${environment}`;

  return `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/${dbName}?schema=public"

# NextAuth
NEXTAUTH_SECRET="${secret}"
NEXTAUTH_URL="${url}"
`;
};

// Create .env file if it doesn't exist
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, createEnvContent('development'));
  console.log('✅ Created .env file');
} else {
  console.log('ℹ️  .env file already exists, skipping...');
}

// Create .env.development file
const envDevPath = path.join(rootDir, '.env.development');
if (!fs.existsSync(envDevPath)) {
  fs.writeFileSync(envDevPath, createEnvContent('development'));
  console.log('✅ Created .env.development file');
} else {
  console.log('ℹ️  .env.development file already exists, skipping...');
}

// Create .env.production file
const envProdPath = path.join(rootDir, '.env.production');
if (!fs.existsSync(envProdPath)) {
  fs.writeFileSync(envProdPath, createEnvContent('production'));
  console.log('✅ Created .env.production file');
} else {
  console.log('ℹ️  .env.production file already exists, skipping...');
}

console.log('\n📝 Next Steps:');
console.log('1. Update the DATABASE_URL in your .env files with your actual PostgreSQL credentials');
console.log('2. Make sure PostgreSQL is running and the database exists');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npx prisma migrate dev --name init');
console.log('5. Run: node scripts/seed.js');
console.log('6. Run: npm run dev');
console.log('\n⚠️  IMPORTANT: Never commit .env files to version control!');
