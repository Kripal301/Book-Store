import React, { useState, useMemo } from 'react';
import { Book } from '../types';
import { Star, SlidersHorizontal } from 'lucide-react';

interface BooksPageProps {
  books: Book[];
  searchQuery: string;
  onNavigate: (page: string, bookId?: string) => void;
  onAddToCart: (book: Book) => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({ books, searchQuery, onNavigate, onAddToCart }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(books.map(b => b.category)))];

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sorted;
  }, [books, sortBy, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-900">All Books</h1>
          {searchQuery && (
            <p className="text-gray-600">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="size-5 text-gray-600" />
              <span className="text-gray-700">Category:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-4">
          Showing {filteredAndSortedBooks.length} {filteredAndSortedBooks.length === 1 ? 'book' : 'books'}
        </p>

        {/* Books Grid */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl">No books found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedBooks.map(book => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div
                  onClick={() => onNavigate('book', book.id)}
                  className="cursor-pointer relative"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform"
                  />
                  {book.stock < 10 && book.stock > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Only {book.stock} left
                    </div>
                  )}
                  {book.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{book.category}</p>
                  <h3
                    onClick={() => onNavigate('book', book.id)}
                    className="text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
                  >
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="size-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-600">{book.rating}</span>
                    <span className="text-sm text-gray-400">({book.reviews.length})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600">Rs. {book.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(book);
                      }}
                      disabled={book.stock === 0}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        book.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
