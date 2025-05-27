import { ClienteLog } from '../../../../../../src/domain/entities/ClienteLog';
import { ClienteLogRepository } from '../../../../../../src/infrastructure/database/mongodb/repositories/ClienteLogRepository';
import { ClienteLogModel } from '../../../../../../src/infrastructure/database/mongodb/models/ClienteLogModel';

jest.mock('../../../../../../src/infrastructure/database/mongodb/models/ClienteLogModel');

describe('ClienteLogRepository', () => {
  const repo = new ClienteLogRepository();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a log using ClienteLogModel', async () => {
    const log = new ClienteLog(
      'cliente-id-123',
      'cliente.cadastrado',
      new Date('2025-05-26T21:00:00Z')
    );

    await repo.create(log);

    expect(ClienteLogModel.create).toHaveBeenCalledWith(log);
  });
});
