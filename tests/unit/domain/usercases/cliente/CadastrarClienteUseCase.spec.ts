import { CadastrarClienteUseCase } from '../../../../../src/domain/usecases/cliente/CadastrarClienteUseCase';
import { IClienteRepository } from '../../../../../src/domain/repositories/IClienteRepository';
import { ICacheService } from '../../../../../src/application/ports/ICacheService';

const fakeRepo: IClienteRepository = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    update: jest.fn()
  };
  

const fakeQueue = {
  publish: jest.fn(),
};

const fakeCache: ICacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  };
  

describe('CadastrarClienteUseCase', () => {
  it('should create a new client successfully', async () => {
    const useCase = new CadastrarClienteUseCase(
      fakeRepo,
      fakeQueue,
      fakeCache
    );

    await useCase.execute({
      nome: 'Rodrigo',
      email: 'rod@example.com',
      telefone: '999999999'
    });

    expect(fakeRepo.create).toHaveBeenCalled();
    expect(fakeQueue.publish).toHaveBeenCalled();
    expect(fakeCache.del).toHaveBeenCalledWith('clientes:lista');
  });

  it('should throw an error if email is already registered', async () => {
    const useCase = new CadastrarClienteUseCase(fakeRepo, fakeQueue, fakeCache);
  
    const duplicateEmailError = {
      name: 'MongoServerError',
      code: 11000,
      keyPattern: { email: 1 }
    };
  
    (fakeRepo.create as jest.Mock).mockRejectedValueOnce(duplicateEmailError);
  
    await expect(useCase.execute({
      nome: 'Rodrigo',
      email: 'rod@example.com',
      telefone: '999999999'
    })).rejects.toThrow('Já existe um cliente com este e-mail');
  
    expect(fakeRepo.create).toHaveBeenCalled();
    expect(fakeQueue.publish).not.toHaveBeenCalled();
    expect(fakeCache.del).not.toHaveBeenCalled();
  });

  it('should rethrow unexpected errors', async () => {
    const useCase = new CadastrarClienteUseCase(fakeRepo, fakeQueue, fakeCache);
  
    const unexpectedError = new Error('Database connection failed');
    (fakeRepo.create as jest.Mock).mockRejectedValueOnce(unexpectedError);
  
    await expect(useCase.execute({
      nome: 'Rodrigo',
      email: 'rod@example.com',
      telefone: '999999999'
    })).rejects.toThrow('Database connection failed');
  });  
});
