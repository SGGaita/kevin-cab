require('dotenv/config');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.log('Please set DATABASE_URL in your .env file');
    console.log('Example: DATABASE_URL=postgresql://user:password@localhost:5432/dbname');
    process.exit(1);
  }

  const isLocal = process.env.DATABASE_URL.includes('localhost') || 
                  process.env.DATABASE_URL.includes('127.0.0.1');

  const poolConfig = {
    connectionString: process.env.DATABASE_URL
  };

  // Only add SSL config if not local
  if (!isLocal) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);

  try {
    console.log('Connecting to database...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Creating tables...');
    await pool.query(schema);
    
    console.log('✓ Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
