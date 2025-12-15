import React from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface OrdersPageProps {
  onNavigate: (page: string, bookId?: string) => void;
}

export const OrdersPage = ({ onNavigate }: OrdersPageProps) => {
  const { orders, currentUser } = useApp();
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your orders</p>
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

  const userOrders = orders.filter(order => order.userId === currentUser.id);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {userOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg text-gray-900">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Date: {order.date}</span>
                      <span>•</span>
                      <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      <span>•</span>
                      <span className="text-indigo-600">Total: ${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  {expandedOrder === order.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {/* Delivery Address */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-sm text-gray-700">{order.paymentMethod}</p>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm text-gray-900 mb-3">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-4 p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm"
                          onClick={() => onNavigate('book-details', item.book.id)}
                        >
                          <img
                            src={item.book.image}
                            alt={item.book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.book.title}</p>
                            <p className="text-sm text-gray-600">by {item.book.author}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-indigo-600">${(item.book.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.book.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
