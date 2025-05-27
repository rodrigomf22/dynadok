import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CadastrarClienteUseCase } from '../../domain/usecases/cliente/CadastrarClienteUseCase';
import { handleHttpError } from '../../shared/errors/HttpErrorHandler';
import { ListarClientesUseCase } from '../../domain/usecases/cliente/ListarClientesUseCase';
import { ConsultarClienteUseCase } from '../../domain/usecases/cliente/ConsultarClienteUseCase';
import { AtualizarClienteUseCase } from '../../domain/usecases/cliente/AtualizarClienteUseCase';

export class ClienteController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, email, telefone } = req.body;

      const useCase = container.resolve(CadastrarClienteUseCase);
      await useCase.execute({ nome, email, telefone });

      return res.status(201).json({ message: 'Client created successfully' });
    } catch (error) {
      return handleHttpError(error, res);
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const useCase = container.resolve(ListarClientesUseCase);
      const clientes = await useCase.execute();

      return res.status(200).json(clientes);
    } catch (error) {
      return handleHttpError(error, res);
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
  
      const useCase = container.resolve(ConsultarClienteUseCase);
      const cliente = await useCase.execute(id);
  
      return res.status(200).json(cliente);
    } catch (error) {
      return handleHttpError(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { nome, email, telefone } = req.body;
  
      const useCase = container.resolve(AtualizarClienteUseCase);
      await useCase.execute({ id, nome, email, telefone });
  
      return res.status(200).json({ message: `Client ${id} updated successfully` });
    } catch (error) {
      return handleHttpError(error, res);
    }
  }
}
