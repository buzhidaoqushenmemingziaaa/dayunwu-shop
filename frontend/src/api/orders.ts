import { apiClient } from './client';
import type { CreateOrderItemInput, Order } from '../types/order';

export function createOrder(
  items: CreateOrderItemInput[],
  paid = false
): Promise<Order> {
  return apiClient.post<Order>('/orders', { items, paid });
}

export function getOrder(id: number): Promise<Order> {
  return apiClient.get<Order>(`/orders/${id}`);
}
