import React, { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Book } from "../types";

interface BookDetailsPageProps {
  bookId: string;
  onNavigate: (page: string) => void;
}

export const BookDetailsPage = ({
  bookId,
  onNavigate,
}: BookDetailsPageProps) => {
  const {
    books,
    addToCart,
    addToWishlist,
    wishlist,
    currentUser,
  } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Book not found
          </p>
          <button
            onClick={() => onNavigate("books")}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Browse all books
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some((b) => b.id === book.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
    setQuantity(1);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onNavigate("login");
      return;
    }
    // In a real app, this would save to backend
    alert(
      "Review submitted! (In a real app, this would be saved)",
    );
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate("books")}
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
                src={book.image}
                alt={book.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            {/* Book Details */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm mb-2">
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-700">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({book.reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl text-indigo-600">
                  ${book.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-5 h-5" />
                  {book.stock > 0 ? (
                    <span>
                      In Stock ({book.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {book.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-lg w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(book.stock, quantity + 1),
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => addToWishlist(book)}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors flex items-center gap-2 ${
                    isInWishlist
                      ? "border-red-600 text-red-600 bg-red-50"
                      : "border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                  {isInWishlist ? "In Wishlist" : "Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-gray-900">
                Customer Reviews
              </h2>
              {currentUser && (
                <button
                  onClick={() =>
                    setShowReviewForm(!showReviewForm)
                  }
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-8 p-6 bg-gray-50 rounded-lg"
              >
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          setNewReview({ ...newReview, rating })
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            rating <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        comment: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Share your thoughts about this book..."
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {book.reviews.length > 0 ? (
              <div className="space-y-6">
                {book.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-gray-900">
                          {review.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {review.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 Rs{
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this
                book!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};