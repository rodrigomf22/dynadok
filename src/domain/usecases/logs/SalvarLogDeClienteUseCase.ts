import { inject, injectable } from 'tsyringe';
import { ClienteLog } from '../../../domain/entities/ClienteLog';
import { IClienteLogRepository } from '../../repositories/IClienteLogRepository.ts';

@injectable()
export class SalvarLogDeClienteUseCase {
  constructor(
    @inject('IClienteLogRepository')
    private readonly logRepository: IClienteLogRepository
  ) {}

  async execute(log: ClienteLog): Promise<void> {
    await this.logRepository.create(log);
  }
}
