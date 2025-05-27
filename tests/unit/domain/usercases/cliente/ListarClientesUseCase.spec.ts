import { ListarClientesUseCase } from '../../../../../src/domain/usecases/cliente/ListarClientesUseCase';
import { IClienteRepository } from '../../../../../src/domain/repositories/IClienteRepository';
import { ICacheService } from '../../../../../src/application/ports/ICacheService';
import { Cliente } from '../../../../../src/domain/entities/Cliente';

describe('ListarClientesUseCase', () => {
  const fakeCliente: Cliente = new Cliente('Rodrigo', 'rod@email.com', '999999999', '123');

  const mockRepo: IClienteRepository = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([fakeCliente]),
    findById: jest.fn(),
    update: jest.fn()
  };

  const mockCache: ICacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return clients from cache if available', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue([fakeCliente]);

    const useCase = new ListarClientesUseCase(mockRepo, mockCache);
    const result = await useCase.execute();

    expect(mockCache.get).toHaveBeenCalledWith('clientes:lista');
    expect(mockRepo.findAll).not.toHaveBeenCalled();
    expect(mockCache.set).not.toHaveBeenCalled();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Cliente);
    expect(result[0].nome).toBe('Rodrigo');
    expect(result[0].email).toBe('rod@email.com');
    expect(result[0].telefone).toBe('999999999');
    expect(result[0].id).toBe('123');
  });

  it('should fetch from repository and cache if not cached', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue(null);

    const useCase = new ListarClientesUseCase(mockRepo, mockCache);
    const result = await useCase.execute();

    expect(mockCache.get).toHaveBeenCalledWith('clientes:lista');
    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith('clientes:lista', [fakeCliente], 300);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Cliente);
    expect(result[0].nome).toBe('Rodrigo');
    expect(result[0].email).toBe('rod@email.com');
    expect(result[0].telefone).toBe('999999999');
    expect(result[0].id).toBe('123');
  });
});
