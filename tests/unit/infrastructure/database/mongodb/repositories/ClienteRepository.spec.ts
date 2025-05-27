import { ClienteRepository } from '../../../../../../src/infrastructure/database/mongodb/repositories/ClienteRepository';
import { ClienteModel } from '../../../../../../src/infrastructure/database/mongodb/models/ClienteModel';
import { Cliente } from '../../../../../../src/domain/entities/Cliente';

jest.mock('../../../../../../src/infrastructure/database/mongodb/models/ClienteModel');

describe('ClienteRepository', () => {
  const repo = new ClienteRepository();

  const mockCliente = new Cliente('Rodrigo', 'rod@email.com', '999999999', 'mocked-id');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client', async () => {
    (ClienteModel.create as jest.Mock).mockResolvedValueOnce(undefined);
  
    await repo.create(mockCliente);
  
    expect(ClienteModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: mockCliente.nome,
        email: mockCliente.email,
        telefone: mockCliente.telefone
      })
    );
  });  

  it('should return all clients', async () => {
    (ClienteModel.find as any).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([
        {
          nome: mockCliente.nome,
          email: mockCliente.email,
          telefone: mockCliente.telefone,
          _id: 'mocked-id',
        },
      ]),
    });

    const result = await repo.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Cliente);
    expect(result[0].email).toBe(mockCliente.email);
  });

  it('should return a client by id', async () => {
    (ClienteModel.findById as any).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce({
        nome: mockCliente.nome,
        email: mockCliente.email,
        telefone: mockCliente.telefone,
        _id: 'mocked-id',
      }),
    });

    const result = await repo.findById('mocked-id');

    expect(result).toBeInstanceOf(Cliente);
    expect(result?.nome).toBe(mockCliente.nome);
  });

  it('should return null when client not found', async () => {
    (ClienteModel.findById as any).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await repo.findById('not-found');

    expect(result).toBeNull();
  });

  it('should update a client', async () => {
    (ClienteModel.findByIdAndUpdate as any).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(undefined),
    });
  
    await repo.update('mocked-id', { nome: 'Novo Nome' });
  
    expect(ClienteModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'mocked-id',
      { nome: 'Novo Nome' },
      { new: true }
    );
  });  
});
