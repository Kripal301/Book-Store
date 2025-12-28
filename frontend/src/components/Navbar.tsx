import React, { useState } from 'react';
import { ShoppingCart, Heart, User, BookOpen, Search, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Use real navigation

export const Navbar: React.FC = () => {
  const navigate = useNavigate(); // ✅ Real navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data (replace later with real context)
  const cart = []; // mock empty cart
  const wishlist = []; // mock empty wishlist
  const currentUser = null; // mock: not logged in

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            <BookOpen className="size-8 text-blue-600" />
            <span className="text-blue-600 font-bold">BookMart</span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigate('/books')}
              className="text-gray-700 hover:text-blue-600"
            >
              Books
            </button>
            
            <button
              onClick={() => handleNavigate('/wishlist')}
              className="relative"
            >
              <Heart className="size-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="size-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1 text-gray-700">
                <User className="size-6" />
                <span>User</span>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onClick={() => handleNavigate('/books')}
              className="block w-full text-left py-2"
            >
              Books
            </button>
            <button
              onClick={() => handleNavigate('/wishlist')}
              className="flex items-center gap-2 py-2"
            >
              <Heart className="size-5" />
              Wishlist ({wishlistCount})
            </button>
            <button
              onClick={() => handleNavigate('/cart')}
              className="flex items-center gap-2 py-2"
            >
              <ShoppingCart className="size-5" />
              Cart ({cartCount})
            </button>
            {currentUser ? (
              <button
                onClick={() => handleNavigate('/profile')}
                className="block w-full text-left py-2"
              >
                Profile
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('/login')}
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