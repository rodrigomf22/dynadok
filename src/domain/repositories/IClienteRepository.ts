import { Cliente } from '../entities/Cliente';

export interface IClienteRepository {
  create(cliente: Cliente): Promise<void>;
  findAll(): Promise<Cliente[]>;
  findById(id: string): Promise<Cliente | null>;
  update(id: string, cliente: Partial<Cliente>): Promise<void>;
}
