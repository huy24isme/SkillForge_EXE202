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

      -- 3. system_plans table
      CREATE TABLE IF NOT EXISTS system_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        code VARCHAR(100) UNIQUE NOT NULL,
        monthly_price NUMERIC DEFAULT 0,
        yearly_price NUMERIC DEFAULT 0,
        max_employees INT DEFAULT 10,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Seed default plans (Basic, Professional, Enterprise)
      INSERT INTO system_plans (id, name, code, monthly_price, yearly_price, max_employees, description, is_active)
      SELECT * FROM (VALUES
        ('c1000000-0000-0000-0000-000000000001'::uuid, 'Gói CƠ BẢN', 'BASIC', 1000000, 10000000, 20, 'Phù hợp doanh nghiệp SME vừa và nhỏ', true),
        ('c2000000-0000-0000-0000-000000000002'::uuid, 'Gói CHUYÊN NGHIỆP', 'PROFESSIONAL', 4000000, 40000000, 50, 'Cho doanh nghiệp tăng trưởng nhanh', true),
        ('c3000000-0000-0000-0000-000000000003'::uuid, 'Gói DOANH NGHIỆP LỚN', 'ENTERPRISE', 9000000, 90000000, 500, 'Giải pháp tùy chỉnh toàn diện', true)
      ) AS v(id, name, code, monthly_price, yearly_price, max_employees, description, is_active)
      WHERE NOT EXISTS (SELECT 1 FROM system_plans);

      -- 4. companies table
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        tax_code VARCHAR(100),
        industry VARCHAR(255),
        size VARCHAR(100),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 5. employees table
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 6. user_accounts table
      CREATE TABLE IF NOT EXISTS user_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(100) DEFAULT 'USER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 7. system_invoices table
      CREATE TABLE IF NOT EXISTS system_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_code VARCHAR(100) UNIQUE NOT NULL,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        plan_id UUID REFERENCES system_plans(id),
        cycle VARCHAR(50) DEFAULT 'MONTHLY',
        amount NUMERIC DEFAULT 0,
        payment_method VARCHAR(50) DEFAULT 'VIETQR',
        status VARCHAR(50) DEFAULT 'PAID',
        paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 8. bsc_templates table
      CREATE TABLE IF NOT EXISTS bsc_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        industry VARCHAR(255) NOT NULL,
        perspective VARCHAR(100) NOT NULL,
        objective_name VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 9. kpi_templates table
      CREATE TABLE IF NOT EXISTS kpi_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        department VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        target NUMERIC DEFAULT 100,
        unit VARCHAR(50) DEFAULT '%',
        frequency VARCHAR(50) DEFAULT 'MONTHLY',
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 10. system_custom_leads table
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

      -- 11. system_reviews table
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
    console.log('PostgreSQL database tables initialized successfully');
  } catch (err) {
    console.error('Failed to init PostgreSQL tables:', err);
  }
}
