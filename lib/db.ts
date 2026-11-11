import { Pool } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:REDACTED_PASSWORD@ep-your-database-id.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Global singleton pool for Next.js hot-reloading
const globalForDb = globalThis as unknown as {
  neonPool: Pool | undefined;
};

export const pool =
  globalForDb.neonPool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.neonPool = pool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 500) {
      console.warn(`[db-slow-query] (${duration}ms): ${text.slice(0, 100)}`);
    }
    return res.rows as T[];
  } catch (error) {
    console.error(`[db-error] in query: ${text.slice(0, 120)}`, error);
    throw error;
  }
}
