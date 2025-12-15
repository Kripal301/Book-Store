import React, { useState } from 'react';
import { Book, Users, Package, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Book as BookType, Order } from '../types';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export const AdminPage = ({ onNavigate }: AdminPageProps) => {
  const { currentUser, books, addBook, updateBook, deleteBook, orders, updateOrderStatus, users } = useApp();
  const [activeTab, setActiveTab] = useState<'books' | 'orders' | 'customers'>('books');
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState<Partial<BookType>>({
    title: '',
    author: '',
    price: 0,
    image: '',
    description: '',
    category: '',
    stock: 0,
    rating: 0,
    reviews: [],
    publishedDate: new Date().toISOString().split('T')[0]
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access Denied</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSaveBook = () => {
    if (editingBook) {
      updateBook(editingBook, bookForm);
      setEditingBook(null);
    } else {
      const newBook: BookType = {
        id: Date.now().toString(),
        title: bookForm.title || '',
        author: bookForm.author || '',
        price: bookForm.price || 0,
        image: bookForm.image || 'https://images.unsplash.com/photo-1764337500043-e9171c903617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwZmljdGlvbnxlbnwxfHx8fDE3NjU2MzY0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: bookForm.description || '',
        category: bookForm.category || '',
        stock: bookForm.stock || 0,
        rating: bookForm.rating || 0,
        reviews: [],
        publishedDate: bookForm.publishedDate || new Date().toISOString().split('T')[0]
      };
      addBook(newBook);
      setShowAddBook(false);
    }
    setBookForm({
      title: '',
      author: '',
      price: 0,
      image: '',
      description: '',
      category: '',
      stock: 0,
      rating: 0,
      reviews: [],
      publishedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditBook = (book: BookType) => {
    setEditingBook(book.id);
    setBookForm(book);
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setShowAddBook(false);
    setBookForm({
      title: '',
      author: '',
      price: 0,
      image: '',
      description: '',
      category: '',
      stock: 0,
      rating: 0,
      reviews: [],
      publishedDate: new Date().toISOString().split('T')[0]
    });
  };

  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    totalCustomers: users.filter(u => !u.isAdmin).length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Books</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalBooks}</p>
              </div>
              <Book className="w-12 h-12 text-indigo-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalCustomers}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl text-gray-900 mt-1">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'books'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Books Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'customers'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Books Management */}
        {activeTab === 'books' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-gray-900">Books Management</h2>
              <button
                onClick={() => setShowAddBook(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Book
              </button>
            </div>

            {/* Add/Edit Book Form */}
            {(showAddBook || editingBook) && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg text-gray-900 mb-4">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={bookForm.price}
                    onChange={(e) => setBookForm({ ...bookForm, price: parseFloat(e.target.value) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={bookForm.stock}
                    onChange={(e) => setBookForm({ ...bookForm, stock: parseInt(e.target.value) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={bookForm.image}
                    onChange={(e) => setBookForm({ ...bookForm, image: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    placeholder="Description"
                    value={bookForm.description}
                    onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                    className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveBook}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Books List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Book</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {books.map(book => (
                    <tr key={book.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded" />
                          <span className="text-sm text-gray-900">{book.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{book.author}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{book.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">${book.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{book.stock}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this book?')) {
                                deleteBook(book.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Orders Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => {
                    const customer = users.find(u => u.id === order.userId);
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{customer?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Customers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.filter(u => !u.isAdmin).map(user => {
                    const userOrdersCount = orders.filter(o => o.userId === user.id).length;
                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.phone || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.address || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{userOrdersCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
