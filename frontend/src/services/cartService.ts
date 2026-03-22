// src/services/cartService.ts
import { api } from './api';
import { Book, CartItem } from '../types';

export interface CartResponse {
  success: boolean;
  cart: CartItem[];
  summary?: {
    itemCount: number;
    subtotal: number;
  };
}

// Helper: Map cart items to include book.id alias
const mapCartItem = (item: any): CartItem => ({
  ...item,
  book: {
    ...item.book,
    id: item.book._id,
  },
});

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get<CartResponse>('/cart');
    return {
      ...response,
      cart: response.cart.map(mapCartItem),
    };
  },

  addToCart: async (bookId: string, quantity: number = 1): Promise<CartResponse> => {
    const response = await api.post<CartResponse>('/cart', { bookId, quantity });
    return {
      ...response,
      cart: response.cart.map(mapCartItem),
    };
  },

  updateCartItem: async (bookId: string, quantity: number): Promise<CartResponse> => {
    const response = await api.put<CartResponse>(`/cart/${bookId}`, { quantity });
    return {
      ...response,
      cart: response.cart.map(mapCartItem),
    };
  },

  removeFromCart: async (bookId: string): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>(`/cart/${bookId}`);
    return {
      ...response,
      cart: response.cart.map(mapCartItem),
    };
  },

  clearCart: async (): Promise<{ success: boolean; message: string }> => {
    return api.delete<{ success: boolean; message: string }>('/cart');
  },
};