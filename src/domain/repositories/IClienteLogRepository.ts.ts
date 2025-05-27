import { ClienteLog } from '../entities/ClienteLog';

export interface IClienteLogRepository {
  create(log: ClienteLog): Promise<void>;
}
