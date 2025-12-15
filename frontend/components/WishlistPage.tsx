import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WishlistPageProps {
  onNavigate: (page: string, bookId?: string) => void;
}

export const WishlistPage = ({ onNavigate }: WishlistPageProps) => {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const handleAddToCart = (book: any) => {
    addToCart(book);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite books for later!</p>
          <button
            onClick={() => onNavigate('books')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <div 
                className="relative cursor-pointer overflow-hidden"
                onClick={() => onNavigate('book-details', book.id)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(book.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              <div className="p-4">
                <h3 
                  className="text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-1"
                  onClick={() => onNavigate('book-details', book.id)}
                >
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xl text-indigo-600">${book.price.toFixed(2)}</span>
                  
                  <button
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stock === 0}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">{book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
