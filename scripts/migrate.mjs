import { Pool } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is required to run migrations.');
  process.exit(1);
}

async function runMigration() {
  console.log('Connecting to Neon PostgreSQL with Pool...');
  const pool = new Pool({ connectionString });

  const migrationPath = path.resolve('./migrations/001_RDM_create_careers_and_recruitment_schema.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  console.log('Applying migration 001_RDM_create_careers_and_recruitment_schema.sql...');
  await pool.query(sqlContent);

  console.log('Migration applied successfully!');

  // Verify tables
  const { rows: tables } = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Public tables in database:', tables.map((t) => t.table_name));

  const { rows: jobRows } = await pool.query('SELECT count(*) FROM jobs;');
  console.log('Seed jobs count:', jobRows[0].count);

  const { rows: adminRows } = await pool.query('SELECT count(*) FROM admin_users;');
  console.log('Admin users count:', adminRows[0].count);

  await pool.end();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
