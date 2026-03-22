// src/pages/Navbar.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingCart, Heart, BookOpen, Search, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Book } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { books, cart, wishlist } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return books
      .filter((book: Book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [searchQuery, books]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    navigate(path);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowSuggestions(value.trim() !== '');
  };

  const handleSuggestionClick = (bookId: string) => {
    onSearchChange('');
    setShowSuggestions(false);
    navigate(`/book/${bookId}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('/')}>
            <BookOpen className="size-8 text-blue-600" />
            <span className="text-blue-600 font-bold text-lg">BookMart</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(searchQuery.trim() !== '')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-60 max-h-60 overflow-y-auto">
                  {suggestions.map((book: Book) => (
                    <div
                      key={book.id}
                      onClick={() => handleSuggestionClick(book.id)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex gap-3 items-start"
                    >
                      <img src={book.image.trim()} alt={book.title} className="w-10 h-14 object-cover rounded shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/60x80?text=No+Image'; }} />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <p className="text-xs text-indigo-600">${book.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => handleNavigate('/books')} className={`text-gray-700 hover:text-blue-600 ${isActive('/books') ? 'text-blue-600 font-medium' : ''}`}>Books</button>
            <button onClick={() => handleNavigate('/wishlist')} className={`relative ${isActive('/wishlist') ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
              <Heart className="size-6" />
              {wishlistCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlistCount}</span>}
            </button>
            <button onClick={() => handleNavigate('/cart')} className={`relative ${isActive('/cart') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
              <ShoppingCart className="size-6" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => handleNavigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
            <input type="text" placeholder="Search books..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => handleNavigate('/books')} className={`block w-full text-left py-2 ${isActive('/books') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>Books</button>
            <button onClick={() => handleNavigate('/wishlist')} className="flex items-center gap-2 py-2 text-gray-700"><Heart className="size-5" /> Wishlist ({wishlistCount})</button>
            <button onClick={() => handleNavigate('/cart')} className="flex items-center gap-2 py-2 text-gray-700"><ShoppingCart className="size-5" /> Cart ({cartCount})</button>
            <button onClick={() => handleNavigate('/login')} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</button>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((book: Book) => (
              <div key={book.id} onClick={() => handleSuggestionClick(book.id)} className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                <img src={book.image.trim()} alt={book.title} className="w-10 h-14 object-cover rounded shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/60x80?text=No+Image'; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-1">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-indigo-600">${book.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};