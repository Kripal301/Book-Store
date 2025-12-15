import React, { useState } from 'react';
import { ShoppingCart, Heart, User, BookOpen, Search, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, searchQuery, onSearchChange }) => {
  const { cart, wishlist, currentUser, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <BookOpen className="size-8 text-blue-600" />
            <span className="text-blue-600">BookStore</span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('books')}
              className={`${currentPage === 'books' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Books
            </button>
            
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative"
            >
              <Heart className={`size-6 ${currentPage === 'wishlist' ? 'text-blue-600 fill-blue-600' : 'text-gray-700'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('cart')}
              className="relative"
            >
              <ShoppingCart className={`size-6 ${currentPage === 'cart' ? 'text-blue-600' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <User className="size-6 text-gray-700" />
                  <span className="text-gray-700">{currentUser.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onNavigate('orders')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => {
                onNavigate('books');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Books
            </button>
            <button
              onClick={() => {
                onNavigate('wishlist');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2"
            >
              <Heart className="size-5" />
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2"
            >
              <ShoppingCart className="size-5" />
              Cart ({cartCount})
            </button>
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate('orders');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2"
                >
                  My Orders
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-blue-600"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
