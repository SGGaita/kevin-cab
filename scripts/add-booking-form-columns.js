const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addBookingFormColumns() {
  const client = await pool.connect();
  
  try {
    console.log('Adding booking_form_heading and booking_form_subtitle columns to contact_info table...');
    
    // Check if columns already exist
    const checkColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'contact_info' 
      AND column_name IN ('booking_form_heading', 'booking_form_subtitle')
    `);
    
    if (checkColumns.rows.length === 2) {
      console.log('Columns already exist. Migration skipped.');
      return;
    }
    
    // Add booking_form_heading column if it doesn't exist
    if (!checkColumns.rows.find(r => r.column_name === 'booking_form_heading')) {
      await client.query(`
        ALTER TABLE contact_info 
        ADD COLUMN booking_form_heading TEXT
      `);
      console.log('✓ booking_form_heading column added');
    }
    
    // Add booking_form_subtitle column if it doesn't exist
    if (!checkColumns.rows.find(r => r.column_name === 'booking_form_subtitle')) {
      await client.query(`
        ALTER TABLE contact_info 
        ADD COLUMN booking_form_subtitle TEXT
      `);
      console.log('✓ booking_form_subtitle column added');
    }
    
    // Set default values for existing rows
    await client.query(`
      UPDATE contact_info 
      SET booking_form_heading = COALESCE(booking_form_heading, 'Instant Booking'),
          booking_form_subtitle = COALESCE(booking_form_subtitle, 'Available 24/7 across all 47 counties.')
    `);
    console.log('✓ Default values set for existing rows');
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addBookingFormColumns()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
