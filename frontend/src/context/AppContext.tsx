  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
    import { Book, User, CartItem, Order } from '../types';
    import { mockBooks, mockUsers, mockOrders } from '../data/mockData';
  
  interface AppContextType {
    // Books
    books: Book[];
    addBook: (book: Book) => void;
    updateBook: (id: string, book: Partial<Book>) => void;
    deleteBook: (id: string) => void;
    
    // User & Auth
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    signup: (name: string, email: string, password: string) => boolean;
    updateProfile: (updates: Partial<User>) => void;
    users: User[];
    
    // Cart
    cart: CartItem[];
    addToCart: (book: Book) => void;
    removeFromCart: (bookId: string) => void;
    updateCartQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    
    // Wishlist
    wishlist: Book[];
    addToWishlist: (book: Book) => void;
    removeFromWishlist: (bookId: string) => void;
    
    // Orders
    orders: Order[];
    createOrder: (deliveryAddress: string, paymentMethod: string) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;
  }
  
  const AppContext = createContext<AppContextType | undefined>(undefined);
  
  export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [books, setBooks] = useState<Book[]>(mockBooks);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Book[]>([]);
    const [orders, setOrders] = useState<Order[]>(mockOrders);
  
    // Load from localStorage
    useEffect(() => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    }, []);
  
    // Save to localStorage
    useEffect(() => {
      if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('currentUser');
      }
    }, [currentUser]);
  
    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
  
    useEffect(() => {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);
  
    // Book Management
    const addBook = (book: Book) => {
      setBooks([...books, book]);
    };
  
    const updateBook = (id: string, updates: Partial<Book>) => {
      setBooks(books.map(book => book.id === id ? { ...book, ...updates } : book));
    };
  
    const deleteBook = (id: string) => {
      setBooks(books.filter(book => book.id !== id));
    };
  
    // Auth
    const login = (email: string, password: string): boolean => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    };
  
    const logout = () => {
      setCurrentUser(null);
      setCart([]);
      setWishlist([]);
    };
  
    const signup = (name: string, email: string, password: string): boolean => {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin: false
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      return true;
    };
  
    const updateProfile = (updates: Partial<User>) => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      }
    };
  
    // Cart
    const addToCart = (book: Book) => {
      const existing = cart.find(item => item.book.id === book.id);
      if (existing) {
        setCart(cart.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, { book, quantity: 1 }]);
      }
    };
  
    const removeFromCart = (bookId: string) => {
      setCart(cart.filter(item => item.book.id !== bookId));
    };
  
    const updateCartQuantity = (bookId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(bookId);
      } else {
        setCart(cart.map(item =>
          item.book.id === bookId ? { ...item, quantity } : item
        ));
      }
    };
  
    const clearCart = () => {
      setCart([]);
    };
  
    // Wishlist
    const addToWishlist = (book: Book) => {
      if (!wishlist.find(b => b.id === book.id)) {
        setWishlist([...wishlist, book]);
      }
    };
  
    const removeFromWishlist = (bookId: string) => {
      setWishlist(wishlist.filter(b => b.id !== bookId));
    };
  
    // Orders
    const createOrder = (deliveryAddress: string, paymentMethod: string) => {
      if (!currentUser || cart.length === 0) return;
      
      const total = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
      
      const newOrder: Order = {
        id: `ORD${Date.now()}`,
        userId: currentUser.id,
        items: [...cart],
        total,
        deliveryAddress,
        paymentMethod,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      setOrders([newOrder, ...orders]);
      clearCart();
    };
  
    const updateOrderStatus = (orderId: string, status: Order['status']) => {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
    };
  
    return (
      <AppContext.Provider
        value={{
          books,
          addBook,
          updateBook,
          deleteBook,
          currentUser,
          login,
          logout,
          signup,
          updateProfile,
          users,
          cart,
          addToCart,
          removeFromCart,
          updateCartQuantity,
          clearCart,
          wishlist,
          addToWishlist,
          removeFromWishlist,
          orders,
          createOrder,
          updateOrderStatus
        }}
      >
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
