// src/components/BookCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  category?: string;
  stock?: number; 
}

interface BookCardProps {
  book: Book;
  onViewDetails: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleViewDetails = () => {
    navigate(`/book/${book.id}`);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering view details
    setIsInWishlist(!isInWishlist);
    const action = isInWishlist ? 'Removed from' : 'Added to';
    alert(`${action} wishlist!`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((book.stock || 999) <= 0) {
      alert('This book is out of stock!');
      return;
    }
    alert(`"${book.title}" added to cart!`);
  };

  const stock = book.stock ?? 999; // default to high stock
  const showLowStock = stock > 0 && stock <= 5;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group flex flex-col">
      {/* Image */}
      <div
        className="relative cursor-pointer overflow-hidden h-64"
        onClick={handleViewDetails}
      >
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/300x400/efefef/999?text=No+Image";
          }}
        />
        {showLowStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Only {stock} left!
          </div>
        )}
        {stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-gray-900 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-1 font-medium"
          onClick={handleViewDetails}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.floor(book.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : star - 0.5 <= book.rating
                  ? 'fill-yellow-400 text-yellow-400' // for half-star approximation
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-700 ml-1">{book.rating.toFixed(1)}</span>
        </div>

        {/* Footer: Price + Actions */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg text-indigo-600 font-bold">
            ${book.price.toFixed(2)}
          </span>

          <div className="flex gap-2">
            {/* Wishlist */}
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full transition-colors ${
                isInWishlist
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors ${
                stock <= 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};