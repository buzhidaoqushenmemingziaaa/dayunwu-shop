import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  open: boolean;
  // 操作
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (it) => it.product.id === product.id
          );
          if (existing) {
            const nextQty = existing.quantity + quantity;
            if (nextQty <= 0) {
              return {
                items: state.items.filter(
                  (it) => it.product.id !== product.id
                ),
              };
            }
            return {
              items: state.items.map((it) =>
                it.product.id === product.id
                  ? { ...it, quantity: nextQty }
                  : it
              ),
            };
          }
          if (quantity <= 0) return {};
          return { items: [...state.items, { product, quantity }] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((it) => it.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((it) => it.product.id !== productId),
            };
          }
          return {
            items: state.items.map((it) =>
              it.product.id === productId ? { ...it, quantity } : it
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      toggle: () => set((state) => ({ open: !state.open })),
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'dayunwu-cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // 只持久化 items，open 不持久化
    }
  )
);

// 派生选择器（组件层直接用）
export const selectTotalItems = (state: CartState) =>
  state.items.reduce((sum, it) => sum + it.quantity, 0);

export const selectTotalAmount = (state: CartState) =>
  state.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
