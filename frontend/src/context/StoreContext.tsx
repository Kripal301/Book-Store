import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem, User, Order } from '../types';
import { mockBooks, mockUsers, mockOrders } from '../data/mockData';
interface StoreContextType {
  books: Book[];
  setBooks: (books: Book[]) => void;
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Book[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  users: User[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedUser = localStorage.getItem('currentUser');
    const savedOrders = localStorage.getItem('orders');
    const savedUsers = localStorage.getItem('users');

    setBooks(savedBooks ? JSON.parse(savedBooks) : mockBooks);
    setCart(savedCart ? JSON.parse(savedCart) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    setOrders(savedOrders ? JSON.parse(savedOrders) : mockOrders);
    setUsers(savedUsers ? JSON.parse(savedUsers) : mockUsers);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.book.id !== bookId));
  };

  const updateCartQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (book: Book) => {
    setWishlist(prev => {
      if (prev.find(b => b.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist(prev => prev.filter(b => b.id !== bookId));
  };

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) {
      return false; // Email already exists
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      isAdmin: false,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return (
    <StoreContext.Provider
      value={{
        books,
        setBooks,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        currentUser,
        login,
        signup,
        logout,
        updateProfile,
        orders,
        addOrder,
        updateOrderStatus,
        users
      }}
    >
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
