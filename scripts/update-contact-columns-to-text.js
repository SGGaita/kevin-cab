const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateContactColumnsToText() {
  const client = await pool.connect();
  
  try {
    console.log('Updating contact_info columns from VARCHAR(255) to TEXT...');
    
    // Get all columns in contact_info table
    const columnsQuery = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'contact_info'
      ORDER BY column_name
    `);
    
    console.log('\nCurrent column types:');
    columnsQuery.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}`);
    });
    
    // Change all VARCHAR columns to TEXT
    const varcharColumns = columnsQuery.rows.filter(col => 
      col.data_type === 'character varying' && col.column_name !== 'id'
    );
    
    if (varcharColumns.length === 0) {
      console.log('\nNo VARCHAR columns to update. All columns are already TEXT.');
      return;
    }
    
    console.log(`\nUpdating ${varcharColumns.length} VARCHAR columns to TEXT...`);
    
    for (const col of varcharColumns) {
      await client.query(`
        ALTER TABLE contact_info 
        ALTER COLUMN ${col.column_name} TYPE TEXT
      `);
      console.log(`✓ ${col.column_name} changed to TEXT`);
    }
    
    console.log('\n✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateContactColumnsToText()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
