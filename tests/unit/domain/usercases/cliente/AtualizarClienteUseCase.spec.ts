import { AtualizarClienteUseCase } from '../../../../../src/domain/usecases/cliente/AtualizarClienteUseCase';
import { IClienteRepository } from '../../../../../src/domain/repositories/IClienteRepository';
import { ICacheService } from '../../../../../src/application/ports/ICacheService';
import { Cliente } from '../../../../../src/domain/entities/Cliente';
import { AppError } from '../../../../../src/shared/errors/AppError';

describe('AtualizarClienteUseCase', () => {
  const clienteExistente = new Cliente('Rodrigo', 'rod@email.com', '999999999', 'abc123');

  const mockRepo: IClienteRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
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

  it('should update the client and clear cache', async () => {
    (mockRepo.findById as jest.Mock).mockResolvedValue(clienteExistente);

    const useCase = new AtualizarClienteUseCase(mockRepo, mockCache);

    await useCase.execute({
      id: 'abc123',
      nome: 'Novo Nome',
      email: 'novo@email.com',
      telefone: '888888888'
    });

    expect(mockRepo.findById).toHaveBeenCalledWith('abc123');
    expect(mockRepo.update).toHaveBeenCalledWith('abc123', {
      nome: 'Novo Nome',
      email: 'novo@email.com',
      telefone: '888888888'
    });

    expect(mockCache.del).toHaveBeenCalledWith('clientes:abc123');
    expect(mockCache.del).toHaveBeenCalledWith('clientes:lista');
  });

  it('should throw if client is not found', async () => {
    (mockRepo.findById as jest.Mock).mockResolvedValue(null);

    const useCase = new AtualizarClienteUseCase(mockRepo, mockCache);

    await expect(useCase.execute({
      id: 'nao-existe',
      nome: 'Teste'
    })).rejects.toThrow(AppError);

    expect(mockRepo.update).not.toHaveBeenCalled();
    expect(mockCache.del).not.toHaveBeenCalled();
  });
});
