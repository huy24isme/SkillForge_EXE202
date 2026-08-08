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
      -- 1. system_admins table
      CREATE TABLE IF NOT EXISTS system_admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        last_login_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Seed default admin account: admin@skillforge.vn / Admin@123456
      INSERT INTO system_admins (id, email, password_hash, full_name, status, created_at, updated_at)
      SELECT gen_random_uuid(), 'admin@skillforge.vn', '$2a$10$D19PYEs5VfcI/PG0NQv0luGIMDvde5I/1e5P9KO4wKIw0RoPIr.E2', 'Supreme Admin', 'ACTIVE', NOW(), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM system_admins WHERE email = 'admin@skillforge.vn');

      -- 2. system_audit_logs table
      CREATE TABLE IF NOT EXISTS system_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID,
        admin_name VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        target VARCHAR(255),
        ip_address VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 3. system_custom_leads table
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

      -- 4. system_reviews table
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
    `);
    console.log('PostgreSQL database tables (system_admins, system_audit_logs, system_custom_leads, system_reviews) initialized successfully');
  } catch (err) {
    console.error('Failed to init PostgreSQL tables:', err);
  }
}
