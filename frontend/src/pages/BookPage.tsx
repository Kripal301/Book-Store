// src/pages/BookPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';  // ✅ Use context instead of mock data
import { Book } from '../types';  // ✅ Import Book type
import { BookCard } from '../components/BookCard';
import { useNavigate } from 'react-router-dom';

interface BooksPageProps {
  searchQuery: string;
}

export const BooksPage = ({ searchQuery }: BooksPageProps) => {
  const navigate = useNavigate();
  
  // ✅ Get data from context instead of mock data
  const { books, loading, error, fetchBooks } = useApp();
  
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // ✅ Fetch books on mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ✅ Extract categories from context books (with type annotation)
  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map((book: Book) => book.category)));
    return ['all', ...cats];
  }, [books]);  // ✅ Add books to dependency array

  const handleViewDetails = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  // ✅ Filter and sort using context books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];  // ✅ Use context books, not mockBooks

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((book: Book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((book: Book) => book.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a: Book, b: Book) => a.price - b.price); 
        break;
      case 'price-high':
        result.sort((a: Book, b: Book) => b.price - a.price); 
        break;
      case 'rating':
        result.sort((a: Book, b: Book) => b.rating - a.rating); 
        break;
      default: // 'newest' → keep original order (by createdAt if available)
        result.sort((a: Book, b: Book) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
    }

    return result;
  }, [books, searchQuery, selectedCategory, sortBy]);  // ✅ Add books to deps

  // ✅ Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  // ✅ Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => fetchBooks()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Books'}
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'book' : 'books'} found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">Category:</span>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category: string) => (  // ✅ Add type annotation
                  <button
                    key={category}  // ✅ category is string, valid as key
                    onClick={() => setSelectedCategory(category)}  // ✅ category is string
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}  // ✅ category is string
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-low' | 'price-high' | 'rating')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredAndSortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedBooks.map((book: Book) => (  // ✅ Add type annotation
              <BookCard
                key={book.id}  // ✅ book.id is string
                book={book}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No books found</p>
            <button
              onClick={() => {
                // Clear search by navigating to home or resetting search
                navigate('/');
              }}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Clear search in navbar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;