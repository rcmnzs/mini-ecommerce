import request from 'supertest';
import app from '../../src/server';
import prisma from '../../src/config/database';

// ─── Mock do Prisma ───────────────────────────────────────────────────────────

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    product: {
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

const mockProduct = {
  id: 'prod-uuid-123',
  name: 'Tênis Nike',
  description: 'Tênis esportivo',
  price: 299.9,
  stock: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── POST /api/v1/products ────────────────────────────────────────────────────

describe('POST /api/v1/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 201 com dados do produto criado', async () => {
    (prismaMock.product.create as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app).post('/api/v1/products').send({
      name: 'Tênis Nike',
      price: 299.9,
      stock: 10,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Tênis Nike');
    expect(res.body.price).toBe(299.9);
  });

  it('deve retornar 400 quando name faltar', async () => {
    const res = await request(app).post('/api/v1/products').send({
      price: 100,
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('deve retornar 400 quando price faltar', async () => {
    const res = await request(app).post('/api/v1/products').send({
      name: 'Produto',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('deve retornar 400 quando price for negativo', async () => {
    const res = await request(app).post('/api/v1/products').send({
      name: 'Produto',
      price: -10,
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('deve retornar 400 quando stock for negativo', async () => {
    const res = await request(app).post('/api/v1/products').send({
      name: 'Produto',
      price: 10,
      stock: -1,
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

// ─── GET /api/v1/products ─────────────────────────────────────────────────────

describe('GET /api/v1/products', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com lista de produtos', async () => {
    (prismaMock.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('deve retornar 200 com lista vazia', async () => {
    (prismaMock.product.findMany as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/v1/products');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─── GET /api/v1/products/:id ─────────────────────────────────────────────────

describe('GET /api/v1/products/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com o produto encontrado', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/v1/products/prod-uuid-123');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('prod-uuid-123');
  });

  it('deve retornar 404 quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/v1/products/id-inexistente');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

// ─── PUT /api/v1/products/:id ─────────────────────────────────────────────────

describe('PUT /api/v1/products/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 200 com produto atualizado', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
    (prismaMock.product.update as jest.Mock).mockResolvedValue({
      ...mockProduct,
      name: 'Tênis Adidas',
    });

    const res = await request(app)
      .put('/api/v1/products/prod-uuid-123')
      .send({ name: 'Tênis Adidas' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Tênis Adidas');
  });

  it('deve retornar 404 quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put('/api/v1/products/id-inexistente')
      .send({ name: 'Novo' });

    expect(res.status).toBe(404);
  });
});

// ─── DELETE /api/v1/products/:id ──────────────────────────────────────────────

describe('DELETE /api/v1/products/:id', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar 204 ao deletar produto existente', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
    (prismaMock.product.delete as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app).delete('/api/v1/products/prod-uuid-123');

    expect(res.status).toBe(204);
  });

  it('deve retornar 404 quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    const res = await request(app).delete('/api/v1/products/id-inexistente');

    expect(res.status).toBe(404);
  });
});
