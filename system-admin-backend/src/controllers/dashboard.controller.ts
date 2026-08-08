import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';

export async function getDashboardStats(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const tenantsRes = await pool.query(
      `SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END)::int as active
       FROM companies`
    );
    const totalTenants = tenantsRes.rows[0].total || 0;
    const activeTenants = tenantsRes.rows[0].active || 0;
    const lockedTenants = totalTenants - activeTenants;

    const invoicesRes = await pool.query(
      `SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int as pending,
        COALESCE(SUM(CASE WHEN status = 'SUCCESS' THEN amount ELSE 0 END), 0) as revenue
       FROM system_invoices`
    );
    const totalInvoices = invoicesRes.rows[0].total || 0;
    const pendingInvoices = invoicesRes.rows[0].pending || 0;
    const totalRevenue = parseFloat(invoicesRes.rows[0].revenue || '0');

    const kpiRes = await pool.query(`SELECT COUNT(*)::int as total FROM kpi_templates WHERE is_active = true`);
    const totalKpiTemplates = kpiRes.rows[0].total || 0;

    const bscRes = await pool.query(`SELECT COUNT(*)::int as total FROM bsc_templates WHERE is_active = true`);
    const totalBscTemplates = bscRes.rows[0].total || 0;

    return sendSuccess(res, {
      totalTenants,
      activeTenants,
      lockedTenants,
      totalInvoices,
      pendingInvoices,
      totalRevenue,
      totalKpiTemplates,
      totalBscTemplates,
    });
  } catch (err: any) {
    console.error('Dashboard stats error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
