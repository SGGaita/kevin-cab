const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addFirstLoginColumn() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration: Adding first_login column to users table...');
    
    // Add first_login column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;
    `);
    console.log('✓ Added first_login column');
    
    // Set existing users to false (they've already logged in)
    const result = await client.query(`
      UPDATE users 
      SET first_login = false 
      WHERE first_login IS NULL;
    `);
    console.log(`✓ Updated ${result.rowCount} existing users to first_login = false`);
    
    // Verify the column exists
    const verifyResult = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'first_login';
    `);
    
    if (verifyResult.rows.length > 0) {
      console.log('✓ Migration completed successfully!');
      console.log('Column details:', verifyResult.rows[0]);
    } else {
      console.error('✗ Migration verification failed - column not found');
    }
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addFirstLoginColumn()
  .then(() => {
    console.log('\n✓ First login migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  });
