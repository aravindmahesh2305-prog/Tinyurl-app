import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    const requiresSSL = connectionString.includes('neon.tech') || 
                       connectionString.includes('railway.app') ||
                       connectionString.includes('sslmode=require');
    
    const poolConfig: PoolConfig = {
      connectionString,
      ssl: requiresSSL ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
    };
    
    pool = new Pool(poolConfig);
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }
  return pool;
}

export async function initDatabase() {
  const pool = getPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted BOOLEAN DEFAULT FALSE
      );
      
      CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
      CREATE INDEX IF NOT EXISTS idx_links_deleted ON links(deleted);
    `);
  } catch (error: any) {
    console.error('Error initializing database:', error);
    if (error.code === 'ENOTFOUND') {
      throw new Error('Database connection failed: Could not resolve database hostname. Please check your DATABASE_URL.');
    }
    throw error;
  }
}

