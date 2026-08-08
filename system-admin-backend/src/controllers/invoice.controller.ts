import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';

export async function getInvoices(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string || '0', 10);
    const size = parseInt(req.query.size as string || '20', 10);
    const offset = page * size;

    // Auto-expire pending invoices older than 2 minutes
    await pool.query(
      `UPDATE system_invoices 
       SET status = 'FAILED', updated_at = NOW() 
       WHERE status = 'PENDING' AND (created_at < NOW() - INTERVAL '2 minutes' OR created_at IS NULL)`
    );

    const result = await pool.query(
      `SELECT 
        i.id, i.invoice_code, i.company_id, i.cycle, i.amount, i.payment_method, 
        i.status, i.paid_at, i.note, i.created_at,
        c.name as company_name,
        p.code as plan_code, p.name as plan_name
       FROM system_invoices i
       JOIN companies c ON i.company_id = c.id
       JOIN system_plans p ON i.plan_id = p.id
       ORDER BY i.created_at DESC
       LIMIT $1 OFFSET $2`,
      [size, offset]
    );

    const invoices = result.rows.map((row) => ({
      id: row.id,
      invoiceCode: row.invoice_code,
      companyId: row.company_id,
      companyName: row.company_name,
      planCode: row.plan_code,
      planName: row.plan_name,
      cycle: row.cycle,
      amount: parseFloat(row.amount || '0'),
      paymentMethod: row.payment_method,
      status: row.status,
      paidAt: row.paid_at ? new Date(row.paid_at).toISOString() : null,
      note: row.note,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return sendSuccess(res, invoices);
  } catch (err: any) {
    console.error('Get invoices error:', err);
    return sendSuccess(res, []);
  }
}

export async function updateInvoiceStatus(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { invoiceId } = req.params;
    const statusVal = req.query.status || req.body?.status;
    const upperStatus = (statusVal as string || '').toUpperCase();

    if (!['PENDING', 'SUCCESS', 'FAILED'].includes(upperStatus)) {
      return sendError(res, 'Trạng thái hóa đơn không hợp lệ: ' + statusVal, 400);
    }

    const result = await pool.query(
      `UPDATE system_invoices 
       SET status = $1, 
           paid_at = CASE WHEN $1 = 'SUCCESS' THEN NOW() ELSE paid_at END,
           updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [upperStatus, invoiceId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Invoice not found', 404);
    }

    const row = result.rows[0];

    // Sync company status accordingly
    if (upperStatus === 'SUCCESS') {
      await pool.query(`UPDATE companies SET status = 'ACTIVE', updated_at = NOW() WHERE id = $1`, [row.company_id]);
    } else if (upperStatus === 'FAILED') {
      await pool.query(`UPDATE companies SET status = 'INACTIVE', updated_at = NOW() WHERE id = $1 AND status = 'PENDING'`, [row.company_id]);
    }

    // Fetch detail to format response
    const detailRes = await pool.query(
      `SELECT c.name as company_name, p.code as plan_code, p.name as plan_name
       FROM companies c, system_plans p
       WHERE c.id = $1 AND p.id = $2`,
      [row.company_id, row.plan_id]
    );
    const companyName = detailRes.rows[0]?.company_name || '';
    const planCode = detailRes.rows[0]?.plan_code || '';
    const planName = detailRes.rows[0]?.plan_name || '';

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Cập nhật trạng thái hóa đơn', `${row.invoice_code} -> ${upperStatus}`, ipAddress);

    return sendSuccess(res, {
      id: row.id,
      invoiceCode: row.invoice_code,
      companyId: row.company_id,
      companyName,
      planCode,
      planName,
      cycle: row.cycle,
      amount: parseFloat(row.amount || '0'),
      paymentMethod: row.payment_method,
      status: row.status,
      paidAt: row.paid_at ? new Date(row.paid_at).toISOString() : null,
      note: row.note,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Update invoice status error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function deleteInvoice(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { invoiceId } = req.params;

    const invRes = await pool.query(`SELECT * FROM system_invoices WHERE id = $1`, [invoiceId]);
    if (invRes.rows.length === 0) {
      return sendError(res, 'Hóa đơn không tồn tại', 404);
    }
    const invoice = invRes.rows[0];

    // Delete invoice
    await pool.query(`DELETE FROM system_invoices WHERE id = $1`, [invoiceId]);

    // If company status is PENDING, delete unactivated pending company too
    await pool.query(`DELETE FROM user_accounts WHERE employee_id IN (SELECT id FROM employees WHERE company_id = $1)`, [invoice.company_id]);
    await pool.query(`DELETE FROM employees WHERE company_id = $1`, [invoice.company_id]);
    await pool.query(`DELETE FROM departments WHERE company_id = $1`, [invoice.company_id]);
    await pool.query(`DELETE FROM companies WHERE id = $1 AND status = 'PENDING'`, [invoice.company_id]);

    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Xóa hóa đơn rác/hủy', invoice.invoice_code, ipAddress);

    return sendSuccess(res, null, 'Hóa đơn đã được xóa thành công');
  } catch (err: any) {
    console.error('Delete invoice error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
