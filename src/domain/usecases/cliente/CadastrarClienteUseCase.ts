import { injectable, inject } from 'tsyringe';
import { IClienteRepository } from '../../repositories/IClienteRepository';
import { Cliente } from '../../entities/Cliente';
import { AppError } from '../../../shared/errors/AppError';
import { IMessageQueue } from '../../../application/ports/IMessageQueue';
import { ICacheService } from '../../../application/ports/ICacheService';

interface Request {
  nome: string;
  email: string;
  telefone: string;
}

@injectable()
export class CadastrarClienteUseCase {
  constructor(
    @inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,

    @inject('IMessageQueue')
    private readonly messageQueue: IMessageQueue,

    @inject('ICacheService')
    private readonly cacheService: ICacheService
  ) {}

  async execute(data: Request): Promise<void> {
    const cliente = new Cliente(data.nome, data.email, data.telefone);

    try {
      await this.clienteRepository.create(cliente);

      await this.cacheService.del('clientes:lista');

      await this.messageQueue.publish(
        'cliente_events',
        'cliente.cadastrado',
        {
          event: 'cliente.cadastrado',
          email: cliente.email,
          createdAt: new Date().toISOString()
        }
      );
    } catch (error: any) {
      if (
        error.name === 'MongoServerError' &&
        error.code === 11000 &&
        error.keyPattern?.email
      ) {
        throw new AppError('Já existe um cliente com este e-mail', 409);
      }
      throw error;
    }
  }
}
