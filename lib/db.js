import { Pool } from 'pg';

const globalForDb = global;

let pool;

// Determine SSL configuration based on environment
const isLocal = process.env.DATABASE_URL?.includes('localhost') || 
                process.env.DATABASE_URL?.includes('127.0.0.1');

const poolConfig = {
  connectionString: process.env.DATABASE_URL
};

// Only add SSL config if not local
if (!isLocal) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool(poolConfig);
  }
  pool = globalForDb.pool;
}

// Helper function to execute queries
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export { pool };
