import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';
import { generateUniqueInvoiceCode } from '../utils/invoiceCode';

async function mapTenantRow(company: any) {
  // Get plan info from latest invoice
  const invRes = await pool.query(
    `SELECT p.code as plan_code, p.name as plan_name
     FROM system_invoices i
     JOIN system_plans p ON i.plan_id = p.id
     WHERE i.company_id = $1
     ORDER BY i.created_at DESC LIMIT 1`,
    [company.id]
  );
  const planCode = invRes.rows[0]?.plan_code || 'STARTER';
  const planName = invRes.rows[0]?.plan_name || 'Starter';

  // Count employees
  const empRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM employees WHERE company_id = $1`,
    [company.id]
  );
  const employeeCount = empRes.rows[0]?.count || 0;

  // Find admin email
  const adminRes = await pool.query(
    `SELECT u.email
     FROM user_accounts u
     JOIN employees e ON u.employee_id = e.id
     WHERE e.company_id = $1 AND u.role = 'COMPANY_ADMIN'
     LIMIT 1`,
    [company.id]
  );
  const adminEmail = adminRes.rows[0]?.email || '';

  return {
    id: company.id,
    name: company.name,
    taxCode: company.tax_code || '',
    industry: company.industry || '',
    size: company.size || '',
    status: company.status,
    planCode,
    planName,
    employeeCount,
    adminEmail,
    createdAt: company.created_at ? new Date(company.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function getTenants(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM companies ORDER BY created_at DESC`);
    const tenants = await Promise.all(result.rows.map(mapTenantRow));
    return sendSuccess(res, tenants);
  } catch (err: any) {
    console.error('Get tenants error:', err);
    return sendSuccess(res, []);
  }
}

export async function getTenant(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { companyId } = req.params;
    const result = await pool.query(`SELECT * FROM companies WHERE id = $1`, [companyId]);
    if (result.rows.length === 0) {
      return sendError(res, 'Company not found', 404);
    }
    const tenant = await mapTenantRow(result.rows[0]);
    return sendSuccess(res, tenant);
  } catch (err: any) {
    console.error('Get tenant error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function createTenant(req: AuthenticatedAdminRequest, res: Response) {
  const client = await pool.connect();
  try {
    const {
      companyName,
      taxCode,
      industry,
      size,
      planId,
      adminName,
      adminEmail,
      adminPassword,
      cycle,
      paymentMethod,
    } = req.body;

    if (!companyName || !adminEmail || !planId) {
      return sendError(res, 'Company name, admin email, and plan ID are required', 400);
    }

    const cleanEmail = adminEmail.trim().toLowerCase();

    // Check duplicate admin email
    const dupCheck = await client.query(
      `SELECT id FROM user_accounts WHERE LOWER(email) = $1 LIMIT 1`,
      [cleanEmail]
    );
    if (dupCheck.rows.length > 0) {
      return sendError(res, 'Email quản trị đã tồn tại trong hệ thống', 400);
    }

    // Get plan
    const planRes = await client.query(`SELECT * FROM system_plans WHERE id = $1`, [planId]);
    if (planRes.rows.length === 0) {
      return sendError(res, 'Không tìm thấy gói dịch vụ', 404);
    }
    const plan = planRes.rows[0];

    await client.query('BEGIN');

    // 1. Create company
    const compRes = await client.query(
      `INSERT INTO companies (id, name, tax_code, industry, size, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'ACTIVE', NOW(), NOW())
       RETURNING *`,
      [companyName.trim(), taxCode || '', industry || 'Công nghệ', size || '50-100']
    );
    const company = compRes.rows[0];

    // 2. Create department
    const deptRes = await client.query(
      `INSERT INTO departments (id, company_id, name, code, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, 'Ban Giám đốc', 'BGD', 'ACTIVE', NOW(), NOW())
       RETURNING id`,
      [company.id]
    );
    const deptId = deptRes.rows[0].id;

    // 3. Create admin employee
    const empRes = await client.query(
      `INSERT INTO employees (id, company_id, department_id, full_name, email, position_title, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'Quản trị viên Công ty', 'ACTIVE', NOW(), NOW())
       RETURNING id`,
      [company.id, deptId, (adminName || companyName + ' Admin').trim(), cleanEmail]
    );
    const empId = empRes.rows[0].id;

    // 4. Create user account
    const rawPassword = adminPassword || 'Admin@123456';
    const passwordHash = await bcrypt.hash(rawPassword, 10);
    await client.query(
      `INSERT INTO user_accounts (id, employee_id, email, password_hash, role, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'COMPANY_ADMIN', 'ACTIVE', NOW(), NOW())`,
      [empId, cleanEmail, passwordHash]
    );

    // 5. Generate Invoice
    const invoiceCycle = (cycle || 'MONTHLY').toUpperCase() === 'YEARLY' ? 'YEARLY' : 'MONTHLY';
    const amount = invoiceCycle === 'YEARLY' ? plan.yearly_price : plan.monthly_price;

    const invoiceCode = await generateUniqueInvoiceCode(client);

    await client.query(
      `INSERT INTO system_invoices (id, invoice_code, company_id, plan_id, cycle, amount, payment_method, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'PENDING', NOW(), NOW())`,
      [invoiceCode, company.id, plan.id, invoiceCycle, amount, paymentMethod || 'bank_transfer']
    );

    await client.query('COMMIT');

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Khởi tạo Doanh nghiệp mới', `${company.name} (${plan.code})`, ipAddress);

    const tenant = await mapTenantRow(company);
    return sendSuccess(res, tenant, 'Khởi tạo doanh nghiệp thành công');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Create tenant error:', err);
    return sendError(res, err.message || 'Server error', 500);
  } finally {
    client.release();
  }
}

export async function updateTenantStatus(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { companyId } = req.params;
    const statusVal = req.query.status || req.body?.status;
    const upperStatus = (statusVal as string || '').toUpperCase();
    if (!['ACTIVE', 'INACTIVE', 'LOCKED'].includes(upperStatus)) {
      return sendError(res, 'Trạng thái không hợp lệ: ' + statusVal, 400);
    }

    const result = await pool.query(
      `UPDATE companies SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [upperStatus, companyId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Company not found', 404);
    }

    const company = result.rows[0];

    // Also lock/unlock all user accounts belonging to this company
    const userStatus = upperStatus === 'ACTIVE' ? 'ACTIVE' : 'LOCKED';
    await pool.query(
      `UPDATE user_accounts SET status = $1, updated_at = NOW() 
       WHERE employee_id IN (SELECT id FROM employees WHERE company_id = $2)`,
      [userStatus, companyId]
    );

    // Audit
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    const action = upperStatus === 'ACTIVE' ? 'Mở khóa doanh nghiệp' : 'Khóa doanh nghiệp (Đình chỉ truy cập)';
    await writeAuditLog(req.admin?.id || null, 'System Admin', action, `${company.name} -> ${upperStatus}`, ipAddress);

    const tenant = await mapTenantRow(company);
    return sendSuccess(res, tenant);
  } catch (err: any) {
    console.error('Update tenant status error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
