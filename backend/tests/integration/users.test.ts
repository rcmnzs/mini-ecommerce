import request from 'supertest';
import app from '../../src/server';
import prisma from '../../src/config/database';

// ─── Mock do Prisma ───────────────────────────────────────────────────────────

jest.mock('../../src/config/database', () => ({
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

// ─── POST /api/v1/users ───────────────────────────────────────────────────────

describe('POST /api/v1/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 201 com dados do usuário criado', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).post('/api/v1/users').send({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'senha123',
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('joao@email.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('deve retornar 400 quando campos obrigatórios faltarem', async () => {
    const res = await request(app).post('/api/v1/users').send({
      email: 'joao@email.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('deve retornar 400 quando senha tiver menos de 8 caracteres', async () => {
    const res = await request(app).post('/api/v1/users').send({
      name: 'João',
      email: 'joao@email.com',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('deve retornar 409 quando email já estiver cadastrado', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).post('/api/v1/users').send({
      name: 'João',
      email: 'joao@email.com',
      password: 'senha123',
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });
});

// ─── GET /api/v1/users ────────────────────────────────────────────────────────

describe('GET /api/v1/users', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com lista de usuários', async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).not.toHaveProperty('password');
  });

  it('deve retornar 200 com lista vazia', async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─── GET /api/v1/users/:id ────────────────────────────────────────────────────

describe('GET /api/v1/users/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com o usuário encontrado', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).get('/api/v1/users/uuid-123');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('uuid-123');
    expect(res.body).not.toHaveProperty('password');
  });

  it('deve retornar 404 quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/v1/users/id-inexistente');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

// ─── PUT /api/v1/users/:id ────────────────────────────────────────────────────

describe('PUT /api/v1/users/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com usuário atualizado', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.user.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      name: 'João Atualizado',
    });

    const res = await request(app)
      .put('/api/v1/users/uuid-123')
      .send({ name: 'João Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('João Atualizado');
  });

  it('deve retornar 404 quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put('/api/v1/users/id-inexistente')
      .send({ name: 'Novo' });

    expect(res.status).toBe(404);
  });
});

// ─── DELETE /api/v1/users/:id ─────────────────────────────────────────────────

describe('DELETE /api/v1/users/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 204 ao deletar usuário existente', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prismaMock.user.delete as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).delete('/api/v1/users/uuid-123');

    expect(res.status).toBe(204);
  });

  it('deve retornar 404 quando usuário não existir', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/api/v1/users/id-inexistente');

    expect(res.status).toBe(404);
  });
});
