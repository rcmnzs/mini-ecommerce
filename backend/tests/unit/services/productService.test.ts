import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../../../src/services/productService';
import {
  NotFoundException,
  ValidationException,
} from '../../../src/middlewares/errorHandler';
import prisma from '../../../src/config/database';

// ─── Mock do Prisma ───────────────────────────────────────────────────────────

jest.mock('../../../src/config/database', () => ({
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
  category: 'Shoes',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── createProduct ────────────────────────────────────────────────────────────

describe('createProduct', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve criar produto com dados válidos', async () => {
    (prismaMock.product.create as jest.Mock).mockResolvedValue(mockProduct);

    const result = await createProduct({
      name: 'Tênis Nike',
      price: 299.9,
      stock: 10,
      category: 'Shoes',
    });

    expect(result.id).toBe('prod-uuid-123');
    expect(result.name).toBe('Tênis Nike');
    expect(result.price).toBe(299.9);
  });

  it('deve criar produto sem description e stock (opcionais)', async () => {
    (prismaMock.product.create as jest.Mock).mockResolvedValue({
      ...mockProduct,
      description: null,
      stock: 0,
    });

    const result = await createProduct({ name: 'Produto', price: 10, category: 'General' });

    expect(result.description).toBeNull();
    expect(result.stock).toBe(0);
  });

  it('deve lançar ValidationException quando name faltar', async () => {
    await expect(
      createProduct({ name: '', price: 100, category: 'General' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando price faltar', async () => {
    await expect(
      createProduct({ name: 'Produto', price: undefined as unknown as number, category: 'General' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando price for negativo', async () => {
    await expect(
      createProduct({ name: 'Produto', price: -10, category: 'General' }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando stock for negativo', async () => {
    await expect(
      createProduct({ name: 'Produto', price: 10, stock: -1, category: 'General' }),
    ).rejects.toThrow(ValidationException);
  });
});

// ─── getAllProducts ────────────────────────────────────────────────────────────

describe('getAllProducts', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar lista de produtos', async () => {
    (prismaMock.product.findMany as jest.Mock).mockResolvedValue([mockProduct]);

    const result = await getAllProducts();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tênis Nike');
  });

  it('deve retornar lista vazia quando não houver produtos', async () => {
    (prismaMock.product.findMany as jest.Mock).mockResolvedValue([]);

    const result = await getAllProducts();

    expect(result).toHaveLength(0);
  });
});

// ─── getProductById ───────────────────────────────────────────────────────────

describe('getProductById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve retornar produto pelo ID', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    const result = await getProductById('prod-uuid-123');

    expect(result.id).toBe('prod-uuid-123');
  });

  it('deve lançar NotFoundException quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(getProductById('id-inexistente')).rejects.toThrow(NotFoundException);
  });
});

// ─── updateProduct ────────────────────────────────────────────────────────────

describe('updateProduct', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve atualizar produto com dados válidos', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
    (prismaMock.product.update as jest.Mock).mockResolvedValue({
      ...mockProduct,
      name: 'Tênis Adidas',
    });

    const result = await updateProduct('prod-uuid-123', { name: 'Tênis Adidas' });

    expect(result.name).toBe('Tênis Adidas');
  });

  it('deve lançar NotFoundException quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      updateProduct('id-inexistente', { name: 'Novo' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ValidationException quando price for negativo', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    await expect(
      updateProduct('prod-uuid-123', { price: -5 }),
    ).rejects.toThrow(ValidationException);
  });

  it('deve lançar ValidationException quando stock for negativo', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    await expect(
      updateProduct('prod-uuid-123', { stock: -1 }),
    ).rejects.toThrow(ValidationException);
  });
});

// ─── deleteProduct ────────────────────────────────────────────────────────────

describe('deleteProduct', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve deletar produto existente', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);
    (prismaMock.product.delete as jest.Mock).mockResolvedValue(mockProduct);

    await expect(deleteProduct('prod-uuid-123')).resolves.toBeUndefined();
  });

  it('deve lançar NotFoundException quando produto não existir', async () => {
    (prismaMock.product.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(deleteProduct('id-inexistente')).rejects.toThrow(NotFoundException);
  });
});
