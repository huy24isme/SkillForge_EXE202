import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://bsc_user:bsc_password@localhost:5432/bsc_skillforge';
const isRemoteDb = connectionString.includes('render.com') || connectionString.includes('neon.tech') || connectionString.includes('supabase.co') || connectionString.includes('aivencloud.com') || process.env.NODE_ENV === 'production';

export const pool = new Pool({
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export async function initDbTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_custom_leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        company_size VARCHAR(100),
        custom_requirements TEXT,
        deal_amount NUMERIC DEFAULT 0,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE system_custom_leads ADD COLUMN IF NOT EXISTS deal_amount NUMERIC DEFAULT 0;

      CREATE TABLE IF NOT EXISTS system_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company_name VARCHAR(255),
        avatar_url VARCHAR(500),
        rating NUMERIC(3,1) DEFAULT 5.0,
        feature_tag VARCHAR(255) NOT NULL,
        review_text TEXT NOT NULL,
        likes INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'APPROVED',
        detailed_ratings JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE system_reviews ADD COLUMN IF NOT EXISTS detailed_ratings JSONB;
      ALTER TABLE system_reviews ALTER COLUMN rating TYPE NUMERIC(3,1);
      ALTER TABLE system_audit_logs ALTER COLUMN admin_id DROP NOT NULL;
    `);
    console.log('PostgreSQL system_custom_leads & system_reviews tables initialized successfully');
  } catch (err) {
    console.error('Failed to init PostgreSQL tables:', err);
  }
}
