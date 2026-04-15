import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Book } from '../types';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

interface BookCardProps {
  book: Book;
  onViewDetails: (bookId: string) => void;
}

export const BookCard = ({ book, onViewDetails }: BookCardProps) => {
  const { addToCart, addToWishlist, wishlist, cart } = useApp();
  const isInWishlist = wishlist.some(b => b.id === book.id);

  const handleAddToCart = async () => {
    // ✅ Check stock first
    if (book.stock === 0) {
      toast.error('This book is out of stock!');
      return;
    }

    // ✅ Check what's already in cart
    const cartItem = cart.find(item => item.book.id === book.id);
    const alreadyInCart = cartItem ? cartItem.quantity : 0;

    if (alreadyInCart >= book.stock) {
      toast.error(`You already have all available stock (${book.stock}) in your cart!`);
      return;
    }

    try {
      await addToCart(book.id, 1);
      toast.success(`${book.title} added to cart!`);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      toast.error(err.message || 'Failed to add to cart.');
    }
  };

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
        {book.stock === 0 ? (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
            Out of Stock
          </div>
        ) : book.stock < 10 ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            {book.stock} left
          </div>
        ) : null}
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
          <span className="text-xl text-indigo-600">NRs.{book.price.toFixed(2)}</span>

          <div className="flex gap-2">
            <button
              onClick={() => addToWishlist(book)}
              className={`p-2 rounded-full transition-colors ${
                isInWishlist
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">{book.stock === 0 ? 'Out of Stock' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};