import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Book } from '../types';
import { useApp } from '../context/AppContext';

interface BookCardProps {
  book: Book;
  onViewDetails: (bookId: string) => void;
}

export const BookCard = ({ book, onViewDetails }: BookCardProps) => {
  const { addToCart, addToWishlist, wishlist } = useApp();
  const isInWishlist = wishlist.some(b => b.id === book.id);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div 
        className="relative cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(book.id)}
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {book.stock < 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Only {book.stock} left
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 
          className="text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-1"
          onClick={() => onViewDetails(book.id)}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-700">{book.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({book.reviews.length})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl text-indigo-600">RS{book.price.toFixed(2)}</span>
          
          <div className="flex gap-2">
            <button
              onClick={() => addToWishlist(book)}
              className={`p-2 rounded-full transition-colors RS{
                isInWishlist 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 RS{isInWishlist ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => addToCart(book)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              disabled={book.stock === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
