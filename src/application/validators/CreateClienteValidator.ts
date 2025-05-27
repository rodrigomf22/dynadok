import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../../shared/errors/AppError';

const schema = Joi.object({
  nome: Joi.string().trim().required().messages({
    'string.empty': 'Nome é obrigatório.'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'E-mail é obrigatório.',
    'string.email': 'E-mail inválido.'
  }),
  telefone: Joi.string().trim().required().messages({
    'string.empty': 'Telefone é obrigatório.'
  })
});

export function validateCreateCliente(req: Request, _res: Response, next: NextFunction): void {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map(detail => detail.message).join(', ');
    throw new AppError(`Erro de validação: ${messages}`, 400);
  }

  next();
}
