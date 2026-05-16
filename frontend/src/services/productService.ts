import api from './api';
import { Product, CreateProductPayload, UpdateProductPayload } from '../types/product';

export async function getProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/products');
  return res.data;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const res = await api.post<Product>('/products', payload);
  return res.data;
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  const res = await api.put<Product>(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}
