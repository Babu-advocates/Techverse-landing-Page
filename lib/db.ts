import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || '';

// Global singleton pool for Next.js hot-reloading
const globalForDb = globalThis as unknown as {
  neonPool: Pool | undefined;
};

export const pool =
  globalForDb.neonPool ??
  (connectionString
    ? new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
      })
    : (null as unknown as Pool));

if (process.env.NODE_ENV !== 'production' && pool) {
  globalForDb.neonPool = pool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  if (!pool) {
    console.error('[db-error] DATABASE_URL environment variable is not defined.');
    return [];
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res.rows as T[];
  } catch (err) {
    console.error(`[db-error] in query: ${text.slice(0, 100)}`, err);
    throw err;
  }
}
