import { Response } from 'express';
import { AppError } from '../errors/AppError';

export function handleHttpError(error: unknown, res: Response): Response {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error('Unexpected error:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
