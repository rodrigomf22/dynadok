import { inject, injectable } from 'tsyringe';
import { IClienteRepository } from '../../repositories/IClienteRepository';
import { Cliente } from '../../entities/Cliente';
import { AppError } from '../../../shared/errors/AppError';
import { ICacheService } from '../../../application/ports/ICacheService';

@injectable()
export class ConsultarClienteUseCase {
  constructor(
    @inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,

    @inject('ICacheService')
    private readonly cacheService: ICacheService
  ) {}

  async execute(id: string): Promise<Cliente> {
    const cacheKey = `clientes:${id}`;

    const cached = await this.cacheService.get<Cliente>(cacheKey);
    if (cached) {
      return cached;
    }

    const cliente = await this.clienteRepository.findById(id);

    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    await this.cacheService.set(cacheKey, cliente, 60 * 5);

    return cliente;
  }
}
