import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  console.error('Erro inesperado:', err);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}
