import 'reflect-metadata'; // precisa estar no topo de entrada (já está no server.ts)
import { container } from 'tsyringe';

import { IClienteRepository } from '../domain/repositories/IClienteRepository';
import { ClienteRepository } from '../infrastructure/database/mongodb/repositories/ClienteRepository';

import { CadastrarClienteUseCase } from '../domain/usecases/cliente/CadastrarClienteUseCase';
import { ListarClientesUseCase } from '../domain/usecases/cliente/ListarClientesUseCase';
import { ICacheService } from '../application/ports/ICacheService';
import { RedisService } from '../infrastructure/database/redis/RedisService';
import { ConsultarClienteUseCase } from '../domain/usecases/cliente/ConsultarClienteUseCase';
import { AtualizarClienteUseCase } from '../domain/usecases/cliente/AtualizarClienteUseCase';
import { IMessageQueue } from '../application/ports/IMessageQueue';
import { RabbitMQService } from '../infrastructure/messaging/rabbitmq/RabbitMQService';
import { IClienteLogRepository } from '../domain/repositories/IClienteLogRepository.ts';
import { ClienteLogRepository } from '../infrastructure/database/mongodb/repositories/ClienteLogRepository';
import { SalvarLogDeClienteUseCase } from '../domain/usecases/logs/SalvarLogDeClienteUseCase';

container.register<IClienteRepository>('IClienteRepository', {
  useClass: ClienteRepository
});

container.register('CadastrarClienteUseCase', {
  useClass: CadastrarClienteUseCase
});

container.register('ListarClientesUseCase', {
  useClass: ListarClientesUseCase
});

container.register<ICacheService>('ICacheService', {
  useClass: RedisService
});

container.register('ConsultarClienteUseCase', {
  useClass: ConsultarClienteUseCase
});

container.register('AtualizarClienteUseCase', {
  useClass: AtualizarClienteUseCase
});

container.register<IMessageQueue>('IMessageQueue', {
  useClass: RabbitMQService
});

container.register<IClienteLogRepository>('IClienteLogRepository', {
  useClass: ClienteLogRepository
});

container.register('SalvarLogDeClienteUseCase', {
  useClass: SalvarLogDeClienteUseCase
});