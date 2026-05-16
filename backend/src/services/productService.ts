import prisma from '../config/database';
import {
  NotFoundException,
  ValidationException,
} from '../middlewares/errorHandler';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductResponseDTO,
} from '../dtos/product.dto';

// ─── Product Service ──────────────────────────────────────────────────────────

/**
 * Cria um novo produto.
 * @throws ValidationException - se campos obrigatórios faltarem ou forem inválidos
 */
export async function createProduct(data: CreateProductDTO): Promise<ProductResponseDTO> {
  const { name, price, description, stock } = data;

  if (!name || price === undefined || price === null) {
    throw new ValidationException('Campos obrigatórios: name, price');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new ValidationException('O preço deve ser um número maior ou igual a zero');
  }

  if (stock !== undefined && stock < 0) {
    throw new ValidationException('O estoque não pode ser negativo');
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description ?? null,
      price,
      stock: stock ?? 0,
    },
  });

  return product;
}

/**
 * Lista todos os produtos.
 */
export async function getAllProducts(): Promise<ProductResponseDTO[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return products;
}

/**
 * Busca um produto pelo ID.
 * @throws NotFoundException - se o produto não existir
 */
export async function getProductById(id: string): Promise<ProductResponseDTO> {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundException(
      'Produto não encontrado',
      `Nenhum produto encontrado com o ID: ${id}`,
    );
  }

  return product;
}

/**
 * Atualiza os dados de um produto.
 * @throws NotFoundException   - se o produto não existir
 * @throws ValidationException - se os dados forem inválidos
 */
export async function updateProduct(
  id: string,
  data: UpdateProductDTO,
): Promise<ProductResponseDTO> {
  const { name, price, description, stock } = data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException(
      'Produto não encontrado',
      `Nenhum produto encontrado com o ID: ${id}`,
    );
  }

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    throw new ValidationException('O preço deve ser um número maior ou igual a zero');
  }

  if (stock !== undefined && stock < 0) {
    throw new ValidationException('O estoque não pode ser negativo');
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
    },
  });

  return updated;
}

/**
 * Remove um produto pelo ID.
 * @throws NotFoundException - se o produto não existir
 */
export async function deleteProduct(id: string): Promise<void> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new NotFoundException(
      'Produto não encontrado',
      `Nenhum produto encontrado com o ID: ${id}`,
    );
  }

  await prisma.product.delete({ where: { id } });
}
