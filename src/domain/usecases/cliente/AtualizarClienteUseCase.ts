import { inject, injectable } from 'tsyringe';
import { IClienteRepository } from '../../repositories/IClienteRepository';
import { AppError } from '../../../shared/errors/AppError';
import { ICacheService } from '../../../application/ports/ICacheService';

interface UpdateRequest {
  id: string;
  nome?: string;
  email?: string;
  telefone?: string;
}

@injectable()
export class AtualizarClienteUseCase {
  constructor(
    @inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,

    @inject('ICacheService')
    private readonly cacheService: ICacheService
  ) {}

  async execute({ id, nome, email, telefone }: UpdateRequest): Promise<void> {
    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    await this.clienteRepository.update(id, { nome, email, telefone });

    await this.cacheService.del(`clientes:${id}`);
    await this.cacheService.del('clientes:lista');
  }
}
