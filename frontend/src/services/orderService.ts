// src/services/orderService.ts
import { api } from './api';
import { Order, OrderItem } from '../types';

export interface OrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  orders: Order[];
}

// Map backend order to frontend Order type
const mapOrder = (order: any): Order => ({
  ...order,
  id: order._id || order.id,
  date: order.createdAt || order.date || new Date().toISOString(),
  items: order.items.map((item: any) => ({
    quantity: item.quantity,
    title: item.title,
    author: item.author,
    price: item.price,
    image: item.image,
    book: item.book, // just the ID string from backend
  })),
});

export const orderService = {
  // Create order from current cart
  createOrder: async (
    deliveryAddress: string,
    paymentMethod: string
  ): Promise<OrderResponse> => {
    const response = await api.post<any>('/orders', {
      deliveryAddress,
      paymentMethod,
    });
    return {
      ...response,
      order: mapOrder(response.order),
    };
  },

  // Get logged-in user's orders
  getUserOrders: async (): Promise<OrdersResponse> => {
    const response = await api.get<any>('/orders');
    return {
      ...response,
      orders: response.orders.map(mapOrder),
    };
  },

  // Admin: get all orders
  getAllOrders: async (): Promise<OrdersResponse> => {
    const response = await api.get<any>('/orders/admin/all');
    return {
      ...response,
      orders: response.orders.map(mapOrder),
    };
  },

  // Admin: update order status
  updateOrderStatus: async (
    orderId: string,
    status: Order['status']
  ): Promise<OrderResponse> => {
    const response = await api.put<any>(`/orders/${orderId}/status`, { status });
    return {
      ...response,
      order: mapOrder(response.order),
    };
  },
};