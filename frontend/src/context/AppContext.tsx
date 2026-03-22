  // src/context/AppContext.tsx
  import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
  import { Book, User, CartItem, Order } from '../types';
  import { authService } from '../services/authService';
  import { bookService, BooksResponse } from '../services/bookService';
  import { cartService, CartResponse } from '../services/cartService';
  import { orderService } from '../services/orderService';

  interface AppContextType {
    // Books
    books: Book[];
    loading: boolean;
    error: string | null;
    fetchBooks: (params?: any) => Promise<void>;
    addBook: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Book>;
    updateBook: (id: string, book: Partial<Book>) => Promise<Book>;
    deleteBook: (id: string) => Promise<void>;
    
    // User & Auth
    currentUser: User | null;
    loadingAuth: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    refreshUser: () => Promise<void>;
    
    // Cart
    cart: CartItem[];
    cartLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (bookId: string, quantity?: number) => Promise<void>;
    removeFromCart: (bookId: string) => Promise<void>;
    updateCartQuantity: (bookId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    
    // Wishlist (keep localStorage for now, or add backend later)
    wishlist: Book[];
    addToWishlist: (book: Book) => void;
    removeFromWishlist: (bookId: string) => void;


    createOrder: (deliveryAddress: string, paymentMethod: string) => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    users: User[];
    
    // Orders (optional - implement when ready)
    orders: Order[];

    updateProfile: (updates: Partial<User>) => Promise<void>;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  export const AppProvider = ({ children }: { children: ReactNode }) => {
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
    const [error, setError] = useState<string | null>(null);

      // Load auth state on mount
      useEffect(() => {
        const initializeAuth = async () => {
          try {
            // 🔍 DEBUG: Log token status before calling /auth/me
            const token = localStorage.getItem('token');
            console.log('🔍 initializeAuth: Token in localStorage?', !!token);
            console.log('🔍 initializeAuth: Token first 30 chars:', token?.substring(0, 30) + '...');
            
            if (authService.isAuthenticated()) {
              console.log('🔍 initializeAuth: Calling GET /auth/me...');
              const response = await authService.getMe();
              
              if (response.success) {
                console.log('🔍 initializeAuth: User authenticated:', response.user.email);
                setCurrentUser(response.user);
              } else {
                console.log('🔍 initializeAuth: getMe returned success: false');
                authService.logout();  // This clears the token!
              }
            } else {
              console.log('🔍 initializeAuth: No valid token found, user not authenticated');
            }
          } catch (err: any) {
            // 🔍 DEBUG: Log the exact error
            console.error('❌ initializeAuth: Auth error:', {
              message: err.message,
              name: err.name,
              stack: err.stack,
            });
            
            // This is what clears your token!
            console.log('🔍 initializeAuth: Calling authService.logout() to clear invalid token');
            authService.logout();
          } finally {
            setLoadingAuth(false);
          }
        };
        
        initializeAuth();
      }, []);

    // Load wishlist from localStorage (keep client-side for now)
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
        // Map _id to id for frontend convenience
        const booksWithId = response.books.map(book => ({
          ...book,
          id: book.id
        }));
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
      // Optionally redirect to login page via callback
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

    const updateProfile = useCallback(async (updates: Partial<User>) => {
      if (!currentUser) return;
      
      // TODO: Implement backend API call when ready
      // await userService.updateProfile(currentUser.id, updates);
      
      // For now, update local state
      setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
    }, [currentUser]);

    // ========== CART ==========

    const fetchCart = useCallback(async () => {
      if (!currentUser) return;
      
      setCartLoading(true);
      try {
        const response: CartResponse = await cartService.getCart();
        if (response.success) {
          // ✅ cartService already maps _id → id, so use response.cart directly
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
        const response: CartResponse = await cartService.addToCart(bookId, quantity);
        if (response.success) {
          // ✅ Use response.cart directly (already mapped by service)
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
          setCart(response.cart);  // ✅ Direct assignment
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
          setCart(response.cart);  // ✅ Direct assignment
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

    // ========== WISHLIST (Client-side only for now) ==========

    const addToWishlist = useCallback((book: Book) => {
      setWishlist(prev => {
        if (prev.find(b => b.id === book.id)) return prev;
        return [...prev, book];
      });
    }, []);

    const removeFromWishlist = useCallback((bookId: string) => {
      setWishlist(prev => prev.filter(b => b.id !== bookId));
    }, []);

    // Add fetchOrders function
    const fetchOrders = useCallback(async () => {
      if (!currentUser) return;
      try {
        const response = currentUser.isAdmin
          ? await orderService.getAllOrders()
          : await orderService.getUserOrders();
        if (response.success) {
          setOrders(response.orders);
        }
      } catch (err: any) {
        console.error('Fetch orders error:', err);
      }
    }, [currentUser]);

    // Add useEffect to load orders on login (alongside your cart useEffect)
    useEffect(() => {
      if (currentUser) {
        fetchOrders();
      } else {
        setOrders([]);
      }
    }, [currentUser]);

    // Replace createOrder placeholder
    const createOrder = useCallback(async (deliveryAddress: string, paymentMethod: string) => {
      if (!currentUser || cart.length === 0) return;
      try {
        const response = await orderService.createOrder(deliveryAddress, paymentMethod);
        if (response.success) {
          setOrders(prev => [response.order, ...prev]);
          setCart([]); // backend already cleared cart, sync frontend
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create order');
        throw err;
      }
    }, [currentUser, cart]);

    // Replace updateOrderStatus placeholder
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


    // ========== CONTEXT VALUE ==========

    const value: AppContextType = {
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
      logout,
      signup,
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
      updateOrderStatus,
      createOrder,
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
    if (!context) {
      throw new Error('useApp must be used within AppProvider');
    }
    return context;
  };