import { Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedAdminRequest } from '../middleware/auth';
import { writeAuditLog } from '../services/auditLog.service';

// ── KPI TEMPLATES ──────────────────────────────────────────

export async function getKpiTemplates(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, department, name, target, unit, frequency, description, is_active AS active, created_at
       FROM kpi_templates
       WHERE is_active = true
       ORDER BY created_at DESC`
    );

    const templates = result.rows.map((r) => ({
      id: r.id,
      department: r.department,
      name: r.name,
      target: r.target,
      unit: r.unit,
      frequency: r.frequency,
      description: r.description,
      active: r.active,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return sendSuccess(res, templates);
  } catch (err: any) {
    console.error('Get KPI templates error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function createKpiTemplate(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { department, name, target, unit, frequency, description } = req.body;

    if (!department || !name || !target || !unit || !frequency) {
      return sendError(res, 'Department, name, target, unit, frequency are required', 400);
    }

    const freqUpper = (frequency as string).toUpperCase();
    if (!['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(freqUpper)) {
      return sendError(res, 'Invalid frequency: ' + frequency, 400);
    }

    const result = await pool.query(
      `INSERT INTO kpi_templates (id, department, name, target, unit, frequency, description, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING *`,
      [department.trim(), name.trim(), target.trim(), unit.trim(), freqUpper, description || '']
    );

    const r = result.rows[0];

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Thêm mới KPI thư viện', `${r.name} (${r.department})`, ipAddress);

    return sendSuccess(res, {
      id: r.id,
      department: r.department,
      name: r.name,
      target: r.target,
      unit: r.unit,
      frequency: r.frequency,
      description: r.description,
      active: r.is_active ?? r.active ?? true,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Create KPI template error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function deleteKpiTemplate(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE kpi_templates SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'KPI template not found', 404);
    }

    const r = result.rows[0];

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Xóa KPI thư viện', r.name, ipAddress);

    return sendSuccess(res, null, 'KPI template deleted');
  } catch (err: any) {
    console.error('Delete KPI template error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

// ── BSC TEMPLATES ──────────────────────────────────────────

export async function getBscTemplates(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, industry, perspective, objective, description, is_active AS active, created_at
       FROM bsc_templates
       WHERE is_active = true
       ORDER BY created_at DESC`
    );

    const templates = result.rows.map((r) => ({
      id: r.id,
      industry: r.industry,
      perspective: r.perspective,
      objective: r.objective,
      description: r.description,
      active: r.active,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return sendSuccess(res, templates);
  } catch (err: any) {
    console.error('Get BSC templates error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function createBscTemplate(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { industry, perspective, objective, description } = req.body;

    if (!industry || !perspective || !objective) {
      return sendError(res, 'Industry, perspective, objective are required', 400);
    }

    const persUpper = (perspective as string).toUpperCase();
    if (!['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_GROWTH'].includes(persUpper)) {
      return sendError(res, 'Invalid perspective: ' + perspective, 400);
    }

    const result = await pool.query(
      `INSERT INTO bsc_templates (id, industry, perspective, objective, description, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
       RETURNING *`,
      [industry.trim(), persUpper, objective.trim(), description || '']
    );

    const r = result.rows[0];

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Thêm mới Khung BSC mẫu', `${r.objective} (${r.industry})`, ipAddress);

    return sendSuccess(res, {
      id: r.id,
      industry: r.industry,
      perspective: r.perspective,
      objective: r.objective,
      description: r.description,
      active: r.is_active ?? r.active ?? true,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Create BSC template error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}

export async function deleteBscTemplate(req: AuthenticatedAdminRequest, res: Response) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE bsc_templates SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'BSC template not found', 404);
    }

    const r = result.rows[0];

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(req.admin?.id || null, 'System Admin', 'Xóa Khung BSC mẫu', r.objective, ipAddress);

    return sendSuccess(res, null, 'BSC template deleted');
  } catch (err: any) {
    console.error('Delete BSC template error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
