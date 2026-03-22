// src/context/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book, CartItem, User, Order, CreateBookInput, CreateOrderInput, UpdateBookInput } from '../types';
import { authService } from '../services/authService';
import { bookService, BooksResponse } from '../services/bookService';
import { cartService, CartResponse } from '../services/cartService';

interface StoreContextType {
  // Books
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: (params?: any) => Promise<void>;
  addBook: (book: CreateBookInput) => Promise<Book>;
  updateBook: (id: string, updates: UpdateBookInput) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  
  // Auth
  currentUser: User | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  
  // Cart
  cart: CartItem[];
  cartLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateCartQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Wishlist
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  
  // Orders
  orders: Order[];
  loadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (order: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Users (admin only)
  users: User[];
  fetchUsers: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getMe();
          if (response.success) {
            setCurrentUser(response.user);
          }
        } else {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setCurrentUser(storedUser);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        authService.logout();
      } finally {
        setLoadingAuth(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Load wishlist from localStorage (client-side only for now)
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load cart when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [currentUser]);

  // ========== BOOKS ==========
  
  const fetchBooks = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response: BooksResponse = await bookService.getBooks(params);
      setBooks(response.books);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
      console.error('Fetch books error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = useCallback(async (bookData: CreateBookInput) => {
    const response = await bookService.createBook(bookData);
    setBooks(prev => [...prev, response.book]);
    return response.book;
  }, []);

  const updateBook = useCallback(async (id: string, updates: UpdateBookInput) => {
  const response = await bookService.updateBook(id, updates);
  setBooks(prev => prev.map(b => b.id === id ? response.book : b)); // ✅ b.id
  return response.book;
  }, []);

  const deleteBook = useCallback(async (id: string) => {
  await bookService.deleteBook(id);
  setBooks(prev => prev.filter(b => b.id !== id)); // ✅ b.id
  }, []);


  // ========== AUTH ==========

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoadingAuth(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        setCurrentUser(response.user);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setLoadingAuth(true);
    setError(null);
    try {
      const response = await authService.signup({ name, email, password });
      if (response.success) {
        setCurrentUser(response.user);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return false;
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    setCart([]);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getMe();
        if (response.success) {
          setCurrentUser(response.user);
        }
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      logout();
    }
  }, [logout]);

  // ========== CART ==========

  const fetchCart = useCallback(async () => {
    if (!currentUser) return;
    
    setCartLoading(true);
    try {
      const response: CartResponse = await cartService.getCart();
      if (response.success) {
        setCart(response.cart);
      }
    } catch (err: any) {
      console.error('Fetch cart error:', err);
    } finally {
      setCartLoading(false);
    }
  }, [currentUser]);

  const addToCart = useCallback(async (bookId: string, quantity: number = 1) => {
    try {
      const response = await cartService.addToCart(bookId, quantity);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (bookId: string) => {
    try {
      const response: CartResponse = await cartService.removeFromCart(bookId);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove from cart');
      throw err;
    }
  }, []);

  const updateCartQuantity = useCallback(async (bookId: string, quantity: number) => {
    try {
      const response: CartResponse = await cartService.updateCartItem(bookId, quantity);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update cart');
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear cart');
      throw err;
    }
  }, []);

  // ========== WISHLIST (Client-side only) ==========
  const addToWishlist = useCallback((book: Book) => {
    setWishlist(prev => {
      if (prev.find(b => b.id === book.id)) return prev; // ✅ b.id, book.id
      return [...prev, book];
    });
  }, []);

  const removeFromWishlist = useCallback((bookId: string) => {
    setWishlist(prev => prev.filter(b => b.id !== bookId));
  }, []);

  // ========== ORDERS ==========

  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    
    setLoadingOrders(true);
    try {
      // TODO: Implement backend API call when ready
      // const response = await orderService.getOrders();
      // setOrders(response.orders);
      
      // For now, keep existing orders
    } catch (err: any) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, [currentUser]);

  const createOrder = useCallback(async (orderData: CreateOrderInput): Promise<Order> => {
    // TODO: Implement backend API call when ready
    // const response = await orderService.createOrder(orderData);
    // return response.order;
    
    // For now, create local order with temp ID
    const newOrder: Order = {
      ...orderData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    // TODO: Implement backend API call when ready
    // await orderService.updateOrderStatus(orderId, status);
    
    // For now, update local state
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
  }, []);

  // ========== USERS (Admin) ==========

  const fetchUsers = useCallback(async () => {
    // TODO: Implement backend API call when ready
    // const response = await userService.getUsers();
    // setUsers(response.users);
  }, []);

  // ========== CONTEXT VALUE ==========

  const value: StoreContextType = {
    // Books
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    
    // Auth
    currentUser,
    loadingAuth,
    login,
    signup,
    logout,
    refreshUser,
    
    // Cart
    cart,
    cartLoading,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    
    // Orders
    orders,
    loadingOrders,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    
    // Users
    users,
    fetchUsers,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};