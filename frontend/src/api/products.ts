import { apiClient } from './client';
import type { Product } from '../types/product';

export function getProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>('/products');
}

export function getProduct(id: number): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`);
}
