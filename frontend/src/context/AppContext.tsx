import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book, User, CartItem, Order } from '../types';
import { authService } from '../services/authService';
import { bookService, BooksResponse } from '../services/bookService';
import { cartService, CartResponse } from '../services/cartService';
import { orderService } from '../services/orderService';
import { api } from '../services/api';

interface AppContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: (params?: any) => Promise<void>;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Book>;
  updateBook: (id: string, book: Partial<Book>) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  currentUser: User | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  cart: CartItem[];
  cartLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (bookId: string, quantity?: number) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateCartQuantity: (bookId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  createOrder: (deliveryAddress: string, paymentMethod: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  users: User[];
  orders: Order[];
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== BOOKS ==========
  const fetchBooks = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response: BooksResponse = await bookService.getBooks(params);
      const booksWithId = response.books.map(book => ({ ...book, id: book.id }));
      setBooks(booksWithId);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch books');
      console.error('Fetch books error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBook = useCallback(async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await bookService.createBook(bookData);
    const newBook = { ...response.book, id: response.book.id };
    setBooks(prev => [...prev, newBook]);
    return newBook;
  }, []);

  const updateBook = useCallback(async (id: string, updates: Partial<Book>) => {
    const response = await bookService.updateBook(id, updates);
    const updatedBook = { ...response.book, id: response.book.id };
    setBooks(prev => prev.map(b => b.id === id ? updatedBook : b));
    return updatedBook;
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    await bookService.deleteBook(id);
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  // ========== AUTH ==========
  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setUsers([]);
  }, []);

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

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await authService.getMe();
        if (response.success) setCurrentUser(response.user);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      logout();
    }
  }, [logout]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
  if (!currentUser) return;
  // ✅ Update local state immediately so UI reflects changes
  setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
  }, [currentUser]);

  // ========== CART ==========
  const fetchCart = useCallback(async () => {
    if (!currentUser) return;
    setCartLoading(true);
    try {
      const response: CartResponse = await cartService.getCart();
      if (response.success) setCart(response.cart);
    } catch (err: any) {
      console.error('Fetch cart error:', err);
    } finally {
      setCartLoading(false);
    }
  }, [currentUser]);

  const addToCart = useCallback(async (bookId: string, quantity: number = 1) => {
    try {
      const response: CartResponse = await cartService.addToCart(bookId, quantity);
      if (response.success) setCart(response.cart);
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (bookId: string) => {
    try {
      const response: CartResponse = await cartService.removeFromCart(bookId);
      if (response.success) setCart(response.cart);
    } catch (err: any) {
      setError(err.message || 'Failed to remove from cart');
      throw err;
    }
  }, []);

  const updateCartQuantity = useCallback(async (bookId: string, quantity: number) => {
    try {
      const response: CartResponse = await cartService.updateCartItem(bookId, quantity);
      if (response.success) setCart(response.cart);
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

  // ========== WISHLIST ==========
  const addToWishlist = useCallback((book: Book) => {
    setWishlist(prev => prev.find(b => b.id === book.id) ? prev : [...prev, book]);
  }, []);

  const removeFromWishlist = useCallback((bookId: string) => {
    setWishlist(prev => prev.filter(b => b.id !== bookId));
  }, []);

  // ========== ORDERS ==========
  const fetchOrders = useCallback(async () => {
    if (!currentUser) return;
    try {
      const response = currentUser.isAdmin
        ? await orderService.getAllOrders()
        : await orderService.getUserOrders();
      if (response.success) setOrders(response.orders);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
    }
  }, [currentUser]);

  const createOrder = useCallback(async (deliveryAddress: string, paymentMethod: string) => {
    if (!currentUser || cart.length === 0) return;
    try {
      const response = await orderService.createOrder(deliveryAddress, paymentMethod);
      if (response.success) {
        setOrders(prev => [response.order, ...prev]);
        setCart([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      throw err;
    }
  }, [currentUser, cart]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      if (response.success) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      throw err;
    }
  }, []);

  // ========== USERS ==========
  const fetchUsers = useCallback(async () => {
    if (!currentUser?.isAdmin) return;
    try {
      const response = await api.get<{ success: boolean; users: User[] }>('/users');
      if (response.success) setUsers(response.users);
    } catch (err: any) {
      console.error('Fetch users error:', err);
    }
  }, [currentUser]);

  // ========== EFFECTS ==========

  // 1. Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getMe();
          if (response.success) {
            setCurrentUser(response.user);
          } else {
            authService.logout();
          }
        }
      } catch (err: any) {
        console.error('Auth init error:', err);
        authService.logout();
      } finally {
        setLoadingAuth(false);
      }
    };
    initializeAuth();
  }, []);

  // 2. Fetch books on startup (no auth needed)
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // 3. Wishlist persistence
  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 4. Load user-specific data when auth state changes
  useEffect(() => {
    if (currentUser) {
      fetchCart();
      fetchOrders();
      if (currentUser.isAdmin) {
        fetchUsers();
      }
    } else {
      setCart([]);
      setOrders([]);
      setUsers([]);
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // ========== CONTEXT VALUE ==========
  const value: AppContextType = {
    books, loading, error, fetchBooks, addBook, updateBook, deleteBook,
    currentUser, loadingAuth, login, logout, signup, refreshUser,
    cart, cartLoading, fetchCart, addToCart, removeFromCart, updateCartQuantity, clearCart,
    wishlist, addToWishlist, removeFromWishlist,
    orders, createOrder, updateOrderStatus,
    users,
    updateProfile,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};