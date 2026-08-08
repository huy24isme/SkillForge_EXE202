import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';

export async function getAuditLogs(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string || '0', 10);
    const size = parseInt(req.query.size as string || '50', 10);
    const offset = page * size;

    const result = await pool.query(
      `SELECT id, admin_id, admin_name, action, target, ip_address, created_at
       FROM system_audit_logs
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [size, offset]
    );

    const logs = result.rows.map((row) => ({
      id: row.id,
      adminId: row.admin_id,
      adminName: row.admin_name,
      action: row.action,
      target: row.target,
      ipAddress: row.ip_address,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return sendSuccess(res, logs);
  } catch (err: any) {
    console.error('Get audit logs error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
