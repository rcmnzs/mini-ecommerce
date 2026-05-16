import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';

/**
 * POST /api/v1/products
 * Cadastra um novo produto.
 */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products
 * Lista todos os produtos.
 */
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/products/:id
 * Busca um produto pelo ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/products/:id
 * Atualiza os dados de um produto.
 */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/products/:id
 * Remove um produto pelo ID.
 */
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
