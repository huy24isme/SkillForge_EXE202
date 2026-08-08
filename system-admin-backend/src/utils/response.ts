import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    message: message || undefined,
    data,
  });
}

export function sendError(res: Response, message: string, statusCode: number = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
}
