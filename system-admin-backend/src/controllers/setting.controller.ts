import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';

export async function getSettings(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, setting_key as key, value, description FROM system_settings ORDER BY setting_key ASC`
    );
    return sendSuccess(res, result.rows);
  } catch (err: any) {
    console.error('Get settings error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function updateSettings(req: AuthenticatedAdminRequest, res: Response) {
  const client = await pool.connect();
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings)) {
      return sendError(res, 'Settings array is required', 400);
    }

    await client.query('BEGIN');

    for (const entry of settings) {
      if (!entry.key) continue;
      await client.query(
        `INSERT INTO system_settings (id, setting_key, value, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
         ON CONFLICT (setting_key) DO UPDATE
         SET value = EXCLUDED.value, updated_at = NOW()`,
        [entry.key, entry.value || '']
      );
    }

    await client.query('COMMIT');

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Cập nhật cấu hình hệ thống', `${settings.length} settings`, ipAddress);

    const result = await pool.query(
      `SELECT id, setting_key as key, value, description FROM system_settings ORDER BY setting_key ASC`
    );

    return sendSuccess(res, result.rows);
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Update settings error:', err);
    return sendError(res, err.message || 'Server error', 500);
  } finally {
    client.release();
  }
}
