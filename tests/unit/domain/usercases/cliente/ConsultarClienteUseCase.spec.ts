import { ConsultarClienteUseCase } from '../../../../../src/domain/usecases/cliente/ConsultarClienteUseCase';
import { IClienteRepository } from '../../../../../src/domain/repositories/IClienteRepository';
import { ICacheService } from '../../../../../src/application/ports/ICacheService';
import { Cliente } from '../../../../../src/domain/entities/Cliente';
import { AppError } from '../../../../../src/shared/errors/AppError';

describe('ConsultarClienteUseCase', () => {
  const fakeCliente = new Cliente('Rodrigo', 'rod@email.com', '999999999', 'abc123');

  const mockRepo: IClienteRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(fakeCliente),
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

  it('should return client from cache', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue(fakeCliente);

    const useCase = new ConsultarClienteUseCase(mockRepo, mockCache);
    const result = await useCase.execute('abc123');

    expect(mockCache.get).toHaveBeenCalledWith('clientes:abc123');
    expect(mockRepo.findById).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(Cliente);
    expect(result.nome).toBe('Rodrigo');
    expect(result.email).toBe('rod@email.com');
    expect(result.telefone).toBe('999999999');
    expect(result.id).toBe('abc123');
  });

  it('should fetch client from repository and cache it', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue(null);
    (mockRepo.findById as jest.Mock).mockResolvedValue(fakeCliente);

    const useCase = new ConsultarClienteUseCase(mockRepo, mockCache);
    const result = await useCase.execute('abc123');

    expect(mockCache.get).toHaveBeenCalledWith('clientes:abc123');
    expect(mockRepo.findById).toHaveBeenCalledWith('abc123');
    expect(mockCache.set).toHaveBeenCalledWith('clientes:abc123', fakeCliente, 300);

    expect(result).toBeInstanceOf(Cliente);
    expect(result.nome).toBe('Rodrigo');
    expect(result.email).toBe('rod@email.com');
    expect(result.telefone).toBe('999999999');
    expect(result.id).toBe('abc123');
  });

  it('should throw AppError if client is not found', async () => {
    (mockCache.get as jest.Mock).mockResolvedValue(null);
    (mockRepo.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new ConsultarClienteUseCase(mockRepo, mockCache);

    await expect(useCase.execute('notfound')).rejects.toThrow(AppError);
    await expect(useCase.execute('notfound')).rejects.toHaveProperty('message', 'Cliente não encontrado');
    expect(mockRepo.findById).toHaveBeenCalledWith('notfound');
  });
});
