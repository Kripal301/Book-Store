import React, { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookCard } from './BookCard';

interface BookListingPageProps {
  onNavigate: (page: string, bookId?: string) => void;
  searchQuery?: string;
}

export const BookListingPage = ({ onNavigate, searchQuery = '' }: BookListingPageProps) => {
  const { books } = useApp();
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(books.map(book => book.category)));
    return ['all', ...cats];
  }, [books]);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [books, searchQuery, selectedCategory, sortBy]);

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
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
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
            {filteredAndSortedBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={(id) => onNavigate('book-details', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No books found</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                onNavigate('books');
              }}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
