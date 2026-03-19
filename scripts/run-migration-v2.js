require('dotenv/config');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    process.exit(1);
  }

  const isLocal = process.env.DATABASE_URL.includes('localhost') || 
                  process.env.DATABASE_URL.includes('127.0.0.1');

  const poolConfig = {
    connectionString: process.env.DATABASE_URL
  };

  if (!isLocal) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  const pool = new Pool(poolConfig);

  try {
    console.log('Connecting to database...');
    
    const migrationPath = path.join(__dirname, 'migrate-cms-v2.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running CMS v2 migration...');
    await pool.query(migration);
    
    console.log('✓ Migration completed successfully!');
    console.log('  - Created tables: gallery_images, testimonials, stats_bar, section_headings');
    console.log('  - Updated tables: contact_info, site_settings');
    console.log('  - Seeded default data');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
