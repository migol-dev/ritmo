import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Error interno del servidor local',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
