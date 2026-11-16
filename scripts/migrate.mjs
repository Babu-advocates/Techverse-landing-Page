import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Helper to load .env.local if DATABASE_URL not set in env
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      connectionString = trimmed.split('=')[1].replace(/^["']|["']$/g, '').trim();
      break;
    }
  }
}

if (!connectionString) {
  console.error('Error: DATABASE_URL is required to run migrations.');
  process.exit(1);
}

async function runAllMigrations() {
  console.log('Connecting to Neon PostgreSQL...');
  const pool = new Pool({ connectionString });

  const migrationsDir = path.resolve('./migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration file(s):`, files);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running migration: ${file}...`);
    try {
      await pool.query(sql);
      console.log(`✓ Applied: ${file}`);
    } catch (err) {
      console.error(`✗ Error applying ${file}:`, err);
      throw err;
    }
  }

  // Verify all public tables in database
  const { rows: tables } = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Public tables in database:', tables.map((t) => t.table_name));

  await pool.end();
  console.log('All migrations completed successfully!');
}

runAllMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
