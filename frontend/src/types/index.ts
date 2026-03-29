
export interface User {
  id: string;              // ✅ Required - frontend ID (mapped from backend _id)
  name: string;
  email: string;
  isAdmin: boolean;
  address?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;              // ✅ Required - frontend ID (was _id?: string)
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Book {
  id: string;              // ✅ Required - frontend ID (was _id: string)
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  publishedDate: string;
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface CartItem {
  id?: string;
  book: Book;            
  quantity: number;
  addedAt?: string;
}

export interface OrderItem {
  book: Book;
  quantity: number;
  title: string;      // snapshot at time of order
  author: string;     // snapshot
  price: number;      // snapshot
  image: string;      // snapshot
}

export interface Order {
  id: string;              // ✅ Required - matches your existing definition
  userId: string;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ ADD THESE TYPE ALIASES - Required by StoreContext.tsx
export type CreateBookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookInput = Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderInput = Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;