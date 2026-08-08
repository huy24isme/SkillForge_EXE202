import { Request, Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';

/**
 * 1. Public Endpoint: Create Custom Plan Consultation Request
 */
export async function createCustomLead(req: Request, res: Response) {
  try {
    const {
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      companySize,
      customRequirements,
    } = req.body;

    if (!companyName || !contactName || !contactEmail || !contactPhone) {
      return sendError(res, 'Vui lòng điền đầy đủ Tên công ty, Họ tên, Email và Số điện thoại liên hệ.', 400);
    }

    const result = await pool.query(
      `INSERT INTO system_custom_leads 
        (id, company_name, contact_name, contact_email, contact_phone, company_size, custom_requirements, status, created_at, updated_at)
       VALUES 
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'PENDING', NOW(), NOW())
       RETURNING *`,
      [
        companyName,
        contactName,
        contactEmail,
        contactPhone,
        companySize || '50-100',
        customRequirements || '',
      ]
    );

    const row = result.rows[0];

    // Audit Log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(
      null,
      'Landing Page Visitor',
      'Đăng ký tư vấn Gói Tùy Chỉnh (Custom)',
      `${companyName} (${contactName} - ${contactPhone})`,
      ipAddress
    );

    return sendSuccess(res, {
      id: row.id,
      companyName: row.company_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      companySize: row.company_size,
      customRequirements: row.custom_requirements,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }, 'Đã gửi yêu cầu tư vấn thành công');
  } catch (err: any) {
    console.error('Create custom lead error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 2. Authenticated SA Endpoint: Get All Custom Plan Leads
 */
export async function getCustomLeads(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(`SELECT * FROM system_custom_leads ORDER BY created_at DESC`);
    
    const leads = result.rows.map((row) => ({
      id: row.id,
      companyName: row.company_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      companySize: row.company_size,
      customRequirements: row.custom_requirements,
      dealAmount: parseFloat(row.deal_amount || 0),
      status: row.status, // PENDING | CONTACTED | COMPLETED | CANCELLED
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return sendSuccess(res, leads);
  } catch (err: any) {
    console.error('Get custom leads error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 3. Authenticated SA Endpoint: Update Custom Lead Status
 */
export async function updateCustomLeadStatus(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { leadId } = req.params;
    const statusVal = req.query.status || req.body?.status;
    const dealAmount = parseFloat((req.body?.dealAmount || req.query?.dealAmount || 0).toString());

    const upperStatus = (statusVal as string || '').toUpperCase();
    if (!['PENDING', 'CONTACTED', 'COMPLETED', 'CANCELLED'].includes(upperStatus)) {
      return sendError(res, 'Trạng thái không hợp lệ: ' + statusVal, 400);
    }

    let result;
    if (upperStatus === 'COMPLETED' && dealAmount > 0) {
      result = await pool.query(
        `UPDATE system_custom_leads 
         SET status = $1, deal_amount = $2, updated_at = NOW() 
         WHERE id = $3 
         RETURNING *`,
        [upperStatus, dealAmount, leadId]
      );
    } else {
      result = await pool.query(
        `UPDATE system_custom_leads 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [upperStatus, leadId]
      );
    }

    if (result.rows.length === 0) {
      return sendError(res, 'Lead not found', 404);
    }

    const row = result.rows[0];

    // If status changed to COMPLETED and dealAmount > 0, generate SUCCESS invoice & company
    if (upperStatus === 'COMPLETED' && dealAmount > 0) {
      let companyRes = await pool.query(`SELECT id FROM companies WHERE name = $1 LIMIT 1`, [row.company_name]);
      let companyId: string;

      if (companyRes.rows.length === 0) {
        const newComp = await pool.query(
          `INSERT INTO companies (id, name, tax_code, industry, size, status, created_at, updated_at)
           VALUES (gen_random_uuid(), $1, 'CST-TAX', 'Technology', $2, 'ACTIVE', NOW(), NOW())
           RETURNING id`,
          [row.company_name, row.company_size || '50-200']
        );
        companyId = newComp.rows[0].id;
      } else {
        companyId = companyRes.rows[0].id;
      }

      let planRes = await pool.query(`SELECT id FROM system_plans WHERE code = 'CUSTOM' LIMIT 1`);
      let planId = planRes.rows.length > 0 ? planRes.rows[0].id : null;
      if (!planId) {
        let fallbackPlan = await pool.query(`SELECT id FROM system_plans LIMIT 1`);
        planId = fallbackPlan.rows[0]?.id;
      }

      const countRes = await pool.query(`SELECT COUNT(*)::int as count FROM system_invoices`);
      const count = (countRes.rows[0].count || 0) + 1;
      const year = new Date().getFullYear();
      const invoiceCode = `SKF-${year}-${String(count).padStart(4, '0')}`;

      await pool.query(
        `INSERT INTO system_invoices 
         (id, invoice_code, company_id, plan_id, cycle, amount, payment_method, status, paid_at, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'YEARLY', $4, 'bank_transfer', 'SUCCESS', NOW(), NOW(), NOW())`,
        [invoiceCode, companyId, planId, dealAmount]
      );
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(
      req.admin?.id || null,
      'System Admin',
      'Cập nhật trạng thái Yêu cầu Gói Tùy Chỉnh',
      `${row.company_name} -> ${upperStatus} (${dealAmount.toLocaleString('vi-VN')} VNĐ)`,
      ipAddress
    );

    return sendSuccess(res, {
      id: row.id,
      companyName: row.company_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      companySize: row.company_size,
      customRequirements: row.custom_requirements,
      dealAmount: parseFloat(row.deal_amount || 0),
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Update custom lead status error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

/**
 * 4. Authenticated SA Endpoint: Delete Custom Lead
 */
export async function deleteCustomLead(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { leadId } = req.params;
    const result = await pool.query(`DELETE FROM system_custom_leads WHERE id = $1 RETURNING *`, [leadId]);
    if (result.rows.length === 0) {
      return sendError(res, 'Lead not found', 404);
    }

    const row = result.rows[0];
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(
      req.admin?.id || null,
      'System Admin',
      'Xóa yêu cầu tư vấn Gói Tùy Chỉnh',
      `${row.company_name}`,
      ipAddress
    );

    return sendSuccess(res, null, 'Đã xóa yêu cầu tư vấn thành công');
  } catch (err: any) {
    console.error('Delete custom lead error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
