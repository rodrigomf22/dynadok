import { inject, injectable } from 'tsyringe';
import { IClienteRepository } from '../../repositories/IClienteRepository';
import { Cliente } from '../../entities/Cliente';
import { ICacheService } from '../../../application/ports/ICacheService';

@injectable()
export class ListarClientesUseCase {
  constructor(
    @inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,

    @inject('ICacheService')
    private readonly cacheService: ICacheService
  ) {}

  async execute(): Promise<Cliente[]> {
    const cacheKey = 'clientes:lista';

    const cached = await this.cacheService.get<Cliente[]>(cacheKey);
    if (cached) return cached;

    const clientes = await this.clienteRepository.findAll();
    await this.cacheService.set(cacheKey, clientes, 60 * 5);

    return clientes;
  }
}
