require('dotenv/config');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function createUser() {
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
    
    // Check if user exists
    const checkResult = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      ['driver@kevincab.co.ke']
    );

    if (checkResult.rows.length > 0) {
      console.log('User already exists. Updating password...');
      
      const hashedPassword = await bcrypt.hash('driver123', 10);
      
      await pool.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, 'driver@kevincab.co.ke']
      );
      
      console.log('✓ Password updated successfully!');
    } else {
      console.log('Creating new user...');
      
      const hashedPassword = await bcrypt.hash('driver123', 10);
      const userId = `user_${Date.now()}`;
      
      await pool.query(
        'INSERT INTO users (id, email, password, name, role, phone) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, 'driver@kevincab.co.ke', hashedPassword, 'John Kamau', 'driver', '+254712345678']
      );
      
      console.log('✓ User created successfully!');
    }

    console.log('\n🔑 Login Credentials:');
    console.log('Email: driver@kevincab.co.ke');
    console.log('Password: driver123');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createUser();
