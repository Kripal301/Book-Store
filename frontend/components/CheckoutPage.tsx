import React, { useState } from 'react';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export const CheckoutPage = ({ onNavigate }: CheckoutPageProps) => {
  const { cart, currentUser, createOrder } = useApp();
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'eSewa' | 'Khalti' | 'Card'>('COD');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to checkout</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    onNavigate('cart');
    return null;
  }

  const handlePlaceOrder = () => {
    createOrder(deliveryAddress, paymentMethod);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('orders')}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              View My Orders
            </button>
            <button
              onClick={() => onNavigate('books')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-indigo-600' : step === 'payment' || step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'address' ? 'bg-indigo-600 text-white' : step === 'payment' || step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                1
              </div>
              <span>Delivery Address</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full ${step === 'payment' || step === 'confirm' ? 'bg-green-600' : 'bg-gray-300'}`} style={{ width: step === 'payment' || step === 'confirm' ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-indigo-600' : step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-indigo-600 text-white' : step === 'confirm' ? 'bg-green-600 text-white' : 'bg-gray-300 text-white'}`}>
                2
              </div>
              <span>Payment</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4">
              <div className={`h-full ${step === 'confirm' ? 'bg-green-600' : 'bg-gray-300'}`} style={{ width: step === 'confirm' ? '100%' : '0%' }}></div>
            </div>
            <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-white'}`}>
                3
              </div>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Address */}
            {step === 'address' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl text-gray-900">Delivery Address</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStep('payment'); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={currentUser.name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="+1234567890"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Delivery Address</label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={4}
                        placeholder="Street address, city, postal code"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">Cash on Delivery (COD)</p>
                      <p className="text-sm text-gray-600">Pay when you receive the order</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="eSewa"
                      checked={paymentMethod === 'eSewa'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">eSewa</p>
                      <p className="text-sm text-gray-600">Digital wallet payment</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="Khalti"
                      checked={paymentMethod === 'Khalti'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">Khalti</p>
                      <p className="text-sm text-gray-600">Digital wallet payment</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="Card"
                      checked={paymentMethod === 'Card'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('address')}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm Order */}
            {step === 'confirm' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl text-gray-900 mb-6">Confirm Your Order</h2>

                <div className="space-y-6">
                  {/* Delivery Address */}
                  <div>
                    <h3 className="text-gray-900 mb-2">Delivery Address</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{currentUser.name}</p>
                      <p className="text-gray-700">{phone}</p>
                      <p className="text-gray-700">{deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-gray-900 mb-2">Payment Method</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{paymentMethod}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cart.map(item => (
                        <div key={item.book.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={item.book.image}
                            alt={item.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.book.title}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-indigo-600">${(item.book.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-gray-900">Total</span>
                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">Items: {cart.length}</p>
                <p>Total Quantity: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
