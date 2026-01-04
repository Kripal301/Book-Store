// src/pages/BookDetailsPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Star, ShoppingCart, Heart } from 'lucide-react';
import { mockBooks } from '../data/mockBooks';

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const book = mockBooks.find(b => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Book not found</p>
          <button
            onClick={() => navigate('/books')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Books
          </button>
        </div>
      </div>
    );
  }

  //  Assume stock if not provided (optional improvement)
  const stock = book.stock ?? 10; // default to 10 if not defined
  const isInStock = stock > 0;

  const handleAddToCart = () => {
    if (!isInStock) {
      alert('This book is out of stock!');
      return;
    }
    alert(`Added ${quantity} copy(ies) of "${book.title}" to cart!`);
    // Later: call real cart function with { book, quantity }
  };

  const increment = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/books')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Books
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Image */}
            <div>
              <img
                src={book.imageLink}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-md object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://placehold.co/400x600/efefef/999?text=Book+Cover";
                }}
              />
            </div>

            {/* Book Details */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(book.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium">{book.rating.toFixed(1)}</span>
              </div>

              {/* Price */}
              <div className="text-3xl md:text-4xl text-indigo-600 font-bold mb-6">
                ${book.price.toFixed(2)}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-gray-700 mb-6">
                <Package className="w-5 h-5" />
                {isInStock ? (
                  <span>In Stock ({stock} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/*  QUANTITY SELECTOR */}
              {isInStock && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrement}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      –
                    </button>
                    <span className="text-lg w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={increment}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= stock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                    isInStock
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => alert('Added to wishlist!')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-500 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;