import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export const CartPage = ({ onNavigate }: CartPageProps) => {
  const { cart, removeFromCart, updateCartQuantity, currentUser } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!currentUser) {
      onNavigate('login');
    } else {
      onNavigate('checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start adding some books to your cart!</p>
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
        <h1 className="text-3xl text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.book.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-6">
                  {/* Book Image */}
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-24 h-32 object-cover rounded cursor-pointer"
                    onClick={() => onNavigate('book-details', item.book.id)}
                  />

                  {/* Book Details */}
                  <div className="flex-1">
                    <h3 
                      className="text-lg text-gray-900 mb-1 cursor-pointer hover:text-indigo-600"
                      onClick={() => onNavigate('book-details', item.book.id)}
                    >
                      {item.book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{item.book.author}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCartQuantity(item.book.id, item.quantity - 1)}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.book.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock}
                          className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl text-indigo-600">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.book.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.book.stock && (
                      <p className="text-sm text-red-600 mt-2">
                        Maximum available quantity reached
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.book.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                {subtotal < 50 && (
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-gray-900">Total</span>
                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('books')}
                className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
