// src/components/Navbar.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, BookOpen, Search, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockBooks } from '../data/mockData'; // ✅ Correct: mockData.ts

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Mock cart/wishlist (replace with real context later)
  const cart = [];
  const wishlist = [];
  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  // Search by title, author, AND category (all exist in your mockBooks)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockBooks
      .filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Close dropdown when clicking outside both desktop & mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideDesktop = desktopDropdownRef.current && !desktopDropdownRef.current.contains(target);
      const outsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(target);

      if (outsideDesktop && outsideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowSuggestions = location.pathname === '/' && searchQuery.trim() !== '' && suggestions.length > 0;

  const handleNavigate = (path: string, id?: string) => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    if (id) {
      navigate(`${path}/${id}`);
    } else {
      navigate(path);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    if (location.pathname === '/' && value.trim() !== '') {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (bookId: string) => {
    onSearchChange('');
    setShowSuggestions(false);
    handleNavigate('/book', bookId);
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
            <span className="text-blue-600 font-bold">ClothingStore</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <div className="relative w-full" ref={desktopDropdownRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors, or categories..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  if (location.pathname === '/' && searchQuery.trim() !== '') {
                    setShowSuggestions(true);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Desktop Suggestions Dropdown */}
              {shouldShowSuggestions && showSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-60 max-h-60 overflow-y-auto">
                  {suggestions.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSuggestionClick(book.id)}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={book.image.trim()}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded shrink-0 border border-gray-200"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://placehold.co/60x80/efefef/999?text=No+Image";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-1">{book.title}</p>
                        <p className="text-xs text-gray-600">{book.author} • {book.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Icons */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => handleNavigate('/books')} className="text-gray-700 hover:text-blue-600">
              Books
            </button>
            <button onClick={() => handleNavigate('/wishlist')} className="relative">
              <Heart className="size-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={() => handleNavigate('/cart')} className="relative">
              <ShoppingCart className="size-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
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
        <div className="md:hidden pb-4 relative">
          <div className="relative" ref={mobileDropdownRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books, authors, or categories..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Mobile Suggestions Dropdown */}
            {shouldShowSuggestions && showSuggestions && (
              <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-60 max-h-60 overflow-y-auto">
                {suggestions.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleSuggestionClick(book.id)}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={book.image.trim()}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded shrink-0 border border-gray-200"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://placehold.co/60x80/efefef/999?text=No+Image";
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-1">{book.title}</p>
                      <p className="text-xs text-gray-600">{book.author} • {book.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => handleNavigate('/books')} className="block w-full text-left py-2">
              Books
            </button>
            <button onClick={() => handleNavigate('/wishlist')} className="flex items-center gap-2 py-2">
              <Heart className="size-5" />
              Wishlist ({wishlistCount})
            </button>
            <button onClick={() => handleNavigate('/cart')} className="flex items-center gap-2 py-2">
              <ShoppingCart className="size-5" />
              Cart ({cartCount})
            </button>
            <button
              onClick={() => handleNavigate('/login')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};