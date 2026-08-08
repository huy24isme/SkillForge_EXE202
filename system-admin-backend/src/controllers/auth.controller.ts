import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { writeAuditLog } from '../services/auditLog.service';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await pool.query(
      `SELECT * FROM system_admins WHERE LOWER(email) = $1 LIMIT 1`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return sendError(res, 'Email hoặc mật khẩu không chính xác', 401);
    }

    const admin = result.rows[0];

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return sendError(res, 'Email hoặc mật khẩu không chính xác', 401);
    }

    if (admin.status !== 'ACTIVE') {
      return sendError(res, 'Tài khoản đã bị vô hiệu hóa', 403);
    }

    // Update last_login_at
    await pool.query(
      `UPDATE system_admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [admin.id]
    );

    // Audit log
    const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
    await writeAuditLog(admin.id, admin.full_name, 'Đăng nhập Hệ thống', 'Admin Dashboard', ipAddress);

    const secret = process.env.JWT_SECRET || 'c2tpbGxmb3JnZS1sb2NhbC1qd3Qtc2VjcmV0LWtleS0yMDI2';
    const expiresIn = Number(process.env.JWT_EXPIRATION_SECONDS) || 86400;

    const token = jwt.sign(
      {
        sub: admin.email,
        adminId: admin.id,
        email: admin.email,
        role: 'ROLE_SYSTEM_ADMIN',
      },
      secret,
      { expiresIn }
    );

    return sendSuccess(res, {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        status: admin.status,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return sendError(res, err.message || 'Server error', 500);
  }
}
