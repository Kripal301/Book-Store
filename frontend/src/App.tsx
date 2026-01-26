import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './pages/Header';
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { BookListingPage } from './pages/BookListingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';

type Page = 'home' | 'books' | 'book-details' | 'login' | 'signup' | 'profile' | 'cart' | 'wishlist' | 'checkout' | 'orders' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page: string, bookId?: string) => {
    setCurrentPage(page as Page);
    if (bookId) {
      setSelectedBookId(bookId);
    }
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
          onSearch={handleSearch}
        />
        
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'books' && <BookListingPage onNavigate={handleNavigate} searchQuery={searchQuery} />}
        {currentPage === 'book-details' && <BookDetailsPage bookId={selectedBookId} onNavigate={handleNavigate} />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
        {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'wishlist' && <WishlistPage onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
        {currentPage === 'orders' && <OrdersPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg mb-4">About BookStore</h3>
                <p className="text-gray-400 text-sm">
                  Your trusted online destination for books. We offer a wide selection of titles across all genres.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <button onClick={() => handleNavigate('books')} className="hover:text-white">
                      Browse Books
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate('orders')} className="hover:text-white">
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigate('wishlist')} className="hover:text-white">
                      Wishlist
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg mb-4">Customer Service</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">Help Center</li>
                  <li className="hover:text-white cursor-pointer">Shipping Info</li>
                  <li className="hover:text-white cursor-pointer">Returns</li>
                  <li className="hover:text-white cursor-pointer">Contact Us</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg mb-4">Connect With Us</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-white cursor-pointer">Facebook</li>
                  <li className="hover:text-white cursor-pointer">Twitter</li>
                  <li className="hover:text-white cursor-pointer">Instagram</li>
                  <li className="hover:text-white cursor-pointer">Newsletter</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 BookStore. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}