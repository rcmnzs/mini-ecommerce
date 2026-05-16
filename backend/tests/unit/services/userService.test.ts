import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../../src/services/userService';
import { ConflictException, NotFoundException, ValidationException } from '../../../src/middlewares/errorHandler';
import prisma from '../../../src/config/database';

// ─── Mock do Prisma ───────────────────────────────────────────────────────────

jest.mock('../../../src/config/database', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'uuid-123',
  name: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── createUser ───────────────────────────────────────────────────────────────

describe('createUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve criar usuário com dados válidos', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createUser({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
    });

    expect(result.id).toBe('uuid-123');
    expect(result.email).toBe('joao@email.com');
    expect(result).not.toHaveProperty('password');
  });

  it('deve lançar ValidationException quando campos obrigatórios faltarem', async () => {
    await expect(
      createUser({ name: '', email: 'joao@email.com', password: 'senha123' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando email for inválido', async () => {
    await expect(
      createUser({ name: 'João', email: 'email-invalido', password: 'senha123' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando senha tiver menos de 8 caracteres', async () => {
    await expect(
      createUser({ name: 'João', email: 'joao@email.com', password: '123' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ConflictException quando email já estiver cadastrado', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      createUser({ name: 'João', email: 'joao@email.com', password: 'senha123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('não deve retornar o campo password na resposta', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createUser({
      name: 'João',
      email: 'joao@email.com',
      password: 'senha123',
    });

    expect(result).not.toHaveProperty('password');
  });
});

// ─── getAllUsers ───────────────────────────────────────────────────────────────

describe('getAllUsers', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar lista de usuários sem o campo password', async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

    const result = await getAllUsers();

    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('password');
  });

  it('deve retornar lista vazia quando não houver usuários', async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getAllUsers();

    expect(result).toHaveLength(0);
  });
});

// ─── getUserById ──────────────────────────────────────────────────────────────

describe('getUserById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar usuário pelo ID', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserById('uuid-123');

    expect(result.id).toBe('uuid-123');
    expect(result).not.toHaveProperty('password');
  });

  it('deve lançar NotFoundException quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(getUserById('id-inexistente')).rejects.toThrow(NotFoundException);
  });
});

// ─── updateUser ───────────────────────────────────────────────────────────────

describe('updateUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve atualizar usuário com dados válidos', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.user.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      name: 'João Atualizado',
    });

    const result = await updateUser('uuid-123', { name: 'João Atualizado' });

    expect(result.name).toBe('João Atualizado');
    expect(result).not.toHaveProperty('password');
  });

  it('deve lançar NotFoundException quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(updateUser('id-inexistente', { name: 'Novo' })).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ValidationException quando novo email for inválido', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      updateUser('uuid-123', { email: 'email-invalido' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ConflictException quando novo email já estiver em uso', async () => {
    (prismaMock.user.findUnique as jest.Mock)
      .mockResolvedValueOnce(mockUser)
      .mockResolvedValueOnce({ ...mockUser, id: 'outro-uuid' });

    await expect(
      updateUser('uuid-123', { email: 'outro@email.com' }),
    ).rejects.toThrow(ConflictException);
  });
});

// ─── deleteUser ───────────────────────────────────────────────────────────────

describe('deleteUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve deletar usuário existente', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.user.delete as jest.Mock).mockResolvedValue(mockUser);

    await expect(deleteUser('uuid-123')).resolves.toBeUndefined();
  });

  it('deve lançar NotFoundException quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(deleteUser('id-inexistente')).rejects.toThrow(NotFoundException);
  });
});
