import { apiClient } from './client';
import type { Product, ProductListResult } from '../types/product';

export interface ProductQuery {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: 'default' | 'price_asc' | 'price_desc' | 'newest';
}

export function getProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  const params = new URLSearchParams();
  if (query.keyword) params.set('keyword', query.keyword);
  if (query.category) params.set('category', query.category);
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
  if (query.page !== undefined) params.set('page', String(query.page));
  if (query.pageSize !== undefined) params.set('pageSize', String(query.pageSize));
  if (query.sort) params.set('sort', query.sort);
  const qs = params.toString();
  return apiClient.get<ProductListResult>(`/products${qs ? `?${qs}` : ''}`);
}

export function getProduct(id: number): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`);
}
