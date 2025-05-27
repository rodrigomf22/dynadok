import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../../shared/errors/AppError';

/**
 * Middleware para validar parâmetros `:id` como ObjectId do MongoDB.
 * @param paramName nome do parâmetro (ex: 'id')
 */
export function validateMongoIdParam(paramName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`ID inválido: ${id}`, 400);
    }

    next();
  };
}
