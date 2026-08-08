import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';

export async function getPlans(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, name, code, monthly_price, yearly_price, max_employees, description, is_active AS active
       FROM system_plans
       WHERE is_active = true
       ORDER BY monthly_price ASC`
    );

    const plans = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      monthlyPrice: parseFloat(row.monthly_price || '0'),
      yearlyPrice: parseFloat(row.yearly_price || '0'),
      maxEmployees: row.max_employees,
      description: row.description,
      active: row.active,
    }));

    return sendSuccess(res, plans);
  } catch (err: any) {
    console.error('Get plans error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
