import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticateSystemAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthenticated: Token missing', 401);
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || 'c2tpbGxmb3JnZS1sb2NhbC1qd3Qtc2VjcmV0LWtleS0yMDI2';

  try {
    const decoded: any = jwt.verify(token, secret);
    const role = decoded.role || decoded.authorities?.[0] || 'ROLE_SYSTEM_ADMIN';
    if (role !== 'ROLE_SYSTEM_ADMIN' && role !== 'SYSTEM_ADMIN') {
      return sendError(res, 'Forbidden: Insufficient privileges', 403);
    }
    req.admin = {
      id: decoded.adminId || decoded.sub,
      email: decoded.email || decoded.sub,
      role: 'SYSTEM_ADMIN',
    };
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
}
