import { pool } from '../config/db';

export async function writeAuditLog(
  adminId: string | null,
  adminName: string,
  action: string,
  target: string,
  ipAddress: string
) {
  try {
    await pool.query(
      `INSERT INTO system_audit_logs (id, admin_id, admin_name, action, target, ip_address, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [adminId, adminName, action, target, ipAddress]
    );
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
