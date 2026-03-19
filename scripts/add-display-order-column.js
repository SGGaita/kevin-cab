const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addDisplayOrderColumn() {
  const client = await pool.connect();
  
  try {
    console.log('Adding display_order column to services table...');
    
    // Add display_order column
    await client.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0
    `);
    console.log('✓ display_order column added');
    
    // Set initial display_order values
    await client.query(`
      UPDATE services 
      SET display_order = 0 
      WHERE display_order IS NULL
    `);
    console.log('✓ Initial display_order values set');
    
    // Create index for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_services_display_order 
      ON services(display_order)
    `);
    console.log('✓ Index created');
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addDisplayOrderColumn();
