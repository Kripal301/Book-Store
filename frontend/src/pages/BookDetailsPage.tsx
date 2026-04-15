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
    import { api } from '../services/api';
    import toast from 'react-hot-toast';

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
        cart,
        addToCart,
        addToWishlist,
        wishlist,
        currentUser,
        fetchBooks,
      } = useApp();
      const [quantity, setQuantity] = useState(1);
      const [showReviewForm, setShowReviewForm] = useState(false);
      const [newReview, setNewReview] = useState({
        rating: 5,
        comment: "",
      });


      const book = books.find((b) => b.id === bookId);
      const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
      const [editReview, setEditReview] = useState({ rating: 5, comment: '' });

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

        const handleAddToCart = async () => {
          try {
            // ✅ Also check what's already in cart
            const cartItem = cart.find(item => item.book.id === book.id);
            const alreadyInCart = cartItem ? cartItem.quantity : 0;
            const totalRequested = alreadyInCart + quantity;

            if (totalRequested > book.stock) {
              const remaining = book.stock - alreadyInCart;
              if (remaining <= 0) {
                toast.error(`You already have all available stock (${book.stock}) in your cart!`);
              } else {
                toast.error(`Only ${remaining} more item(s) can be added. You already have ${alreadyInCart} in cart.`);
              }
              return;
            }

            await addToCart(book.id, quantity);
            setQuantity(1);
            toast.success('Added to cart!');
          } catch (err: any) {
            console.error('Error adding to cart:', err);
            toast.error(err.message || 'Failed to add to cart. Please try again.');
          }
        };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
          onNavigate('login');
          return;
        }

        try {
          const response = await api.post<{ success: boolean; book: Book }>(
            `/books/${book.id}/reviews`,
            {
              rating: newReview.rating,
              comment: newReview.comment
            }
          );

          if (response.success) {
            // ✅ Update the book in the books list with new review
            fetchBooks();  // refetch all books to get updated reviews
            setShowReviewForm(false);
            setNewReview({ rating: 5, comment: '' });
            window.alert('Review submitted successfully!');
          }
        } catch (err: any) {
          console.error('Error submitting review:', err);
          window.alert(err.message || 'Failed to submit review. Please try again.');
        }
      };
  const handleEditReview = (review: any, index: number) => {
    // ✅ Try all possible ID sources
    const reviewId = review._id?.toString() || review.id || review.userId?.toString();
    setEditingReviewId(reviewId);
    setEditReview({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put<{ success: boolean; book: Book }>(
        `/books/${book.id}/reviews/${editingReviewId}`,
        {
          rating: editReview.rating,
          comment: editReview.comment
        }
      );
      if (response.success) {
        await fetchBooks();
        setEditingReviewId(null);
        setEditReview({ rating: 5, comment: '' });
      }
    } catch (err: any) {
      console.error('Error updating review:', err);
      window.alert(err.message || 'Failed to update review.');
    }
  };

  const handleDeleteReview = async (review: any, index: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    const reviewId = review.id || review._id?.toString();
    if (!reviewId) {
      window.alert('Cannot delete this review — no ID found.');
      return;
    }
    try {
      await api.delete(`/books/${book.id}/reviews/${reviewId}`);
      await fetchBooks();
    } catch (err: any) {
      console.error('Error deleting review:', err);
      window.alert(err.message || 'Failed to delete review.');
    }
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
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-700">{book.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({book.reviews.length} reviews)</span>
                    </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl text-indigo-600">
                      NRs.{book.price.toFixed(2)}
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
                {/* Reviews List */}
  {book.reviews.length > 0 ? (
    <div className="space-y-6">
      {book.reviews.map((review, index) => (
        <div
          key={review.id || review.userId + index}
          className="border-b border-gray-200 pb-6 last:border-0"
        >
          {editingReviewId === review.id ? (
            <form onSubmit={handleUpdateReview} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Editing your review</p>
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditReview({ ...editReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= editReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Comment</label>
                <textarea
                  value={editReview.comment}
                  onChange={(e) => setEditReview({ ...editReview, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingReviewId(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-900 font-medium">{review.userName}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {currentUser && (
                    currentUser.id === review.userId?.toString() || currentUser.isAdmin
                  ) && (
                    <div className="flex gap-1">
                      {currentUser.id === review.userId?.toString() && (
                        <button
                          onClick={() => handleEditReview(review, index)}
                          className="text-blue-600 hover:bg-blue-50 rounded text-xs px-2 py-1 border border-blue-200"
                        >
                          Edit
                        </button>
                      )}
                      <button
    onClick={() => handleDeleteReview(review, index)}
    className="text-red-600 hover:bg-red-50 rounded text-xs px-2 py-1 border border-red-200"
  >
    Delete
  </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 text-center py-8">
      No reviews yet. Be the first to review this book!
    </p>
  )}
              </div>
            </div>
          </div>
        </div>
      );
    };