import { Cliente } from '../../../../domain/entities/Cliente';
import { IClienteRepository } from '../../../../domain/repositories/IClienteRepository';
import { ClienteModel } from '../models/ClienteModel';
import { injectable } from 'tsyringe';
import { BaseRepository } from './BaseRepository';

@injectable()
export class ClienteRepository extends BaseRepository<Cliente> implements IClienteRepository
{
  constructor() {
    super(ClienteModel);
  }

  protected getEntityClass() {
    return Cliente;
  }

  protected mapDocumentToConstructorArgs(doc: any) {
    return [doc.nome, doc.email, doc.telefone, doc._id.toString(), doc.createdAt, doc.updatedAt];
  }
}
