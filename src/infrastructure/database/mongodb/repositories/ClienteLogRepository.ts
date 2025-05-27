import { ClienteLog } from '../../../../domain/entities/ClienteLog';
import { IClienteLogRepository } from '../../../../domain/repositories/IClienteLogRepository.ts';
import { ClienteLogModel } from '../models/ClienteLogModel';
import { BaseRepository } from './BaseRepository';

export class ClienteLogRepository extends BaseRepository<ClienteLog> implements IClienteLogRepository
{
  constructor() {
    super(ClienteLogModel);
  }

  protected getEntityClass() {
    return ClienteLog;
  }

  protected mapDocumentToConstructorArgs(doc: any) {
    return [
      doc.clienteId,
      doc.email,
      doc.event,
      doc.createdAt,
      doc._id.toString()
    ];
  }
}
