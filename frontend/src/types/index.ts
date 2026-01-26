  export interface Book {
    id: string;
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
  }
  
  export interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    address?: string;
    phone?: string;
  }
  
  export interface CartItem {
    book: Book;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    deliveryAddress: string;
    paymentMethod: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    date: string;
  }
