  // src/pages/AdminPage.tsx
  import React, { useState } from 'react';
  import { Book, Users, Package, Plus, Edit, Trash2, Save, X } from 'lucide-react';
  import { useApp } from '../context/AppContext';
  import { Book as BookType, Order, User, CreateBookInput } from '../types';

  interface AdminPageProps {
    onNavigate: (page: string) => void;
  }

  export const AdminPage = ({ onNavigate }: AdminPageProps) => {
    // ✅ Get values from context (don't redefine anything here!)
    const { 
      currentUser, 
      books, 
      addBook, 
      updateBook, 
      deleteBook, 
      orders, 
      updateOrderStatus, 
      users 
    } = useApp();
    
    const [activeTab, setActiveTab] = useState<'books' | 'orders' | 'customers'>('books');
    const [showAddBook, setShowAddBook] = useState(false);
    const [editingBook, setEditingBook] = useState<string | null>(null);
    
    // ✅ Form state for adding/editing books
    const [bookForm, setBookForm] = useState<Partial<CreateBookInput>>({
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
    // ✅ Categories for dropdown
    const CATEGORIES = [
      'Fiction', 'Self-Help', 'Science', 'Mystery', 'Fantasy',
      'Biography', 'History', 'Science Fiction', 'Romance', 'Thriller', 'Business', 'Other'
    ] as const;

    // ✅ Admin access check
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

    // ✅ Handle save book
    
    const handleSaveBook = async () => {
      try {
        if (editingBook) {
          await updateBook(editingBook, bookForm as Partial<BookType>);
          setEditingBook(null);
        } else {
          // ✅ VALIDATE FRONTEND DATA BEFORE SENDING
          const requiredFields = {
            title: bookForm.title?.trim() || '',
            author: bookForm.author?.trim() || '',
            price: bookForm.price != null ? Number(bookForm.price) : 0,
            image: bookForm.image?.trim() || 'https://placehold.co/400x600?text=No+Image',
            description: bookForm.description?.trim() || '',
            category: (bookForm.category && CATEGORIES.includes(bookForm.category as typeof CATEGORIES[number]))
            ? (bookForm.category as string)
            : 'Other',
            stock: bookForm.stock != null ? Number(bookForm.stock) : 0,
            publishedDate: bookForm.publishedDate?.trim() || new Date().toISOString().split('T')[0]
          };

          // ✅ Check for missing required fields on frontend
          const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

          if (missingFields.length > 0) {
            window.alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
          }

          const newBookData: CreateBookInput = {
            title: requiredFields.title,
            author: requiredFields.author,
            price: requiredFields.price,
            image: requiredFields.image,
            description: requiredFields.description,
            category: requiredFields.category,
            stock: requiredFields.stock,
            rating: 0,  // Backend doesn't validate this field
            reviews: [], // Backend doesn't validate this field
            publishedDate: requiredFields.publishedDate
          };
          
          console.log('🔍 Sending book data:', newBookData); // 🔴 Debug log
          await addBook(newBookData);
          setShowAddBook(false);
        }
        
        // Reset form
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
      } catch (err) {
        console.error('Error saving book:', err);
        window.alert('Failed to save book. Please try again.');
      }
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

    // ✅ Stats calculation
    const stats = {
      totalBooks: books.length,
      totalOrders: orders.length,
      totalCustomers: users.filter((u: User) => !u.isAdmin).length,
      totalRevenue: orders.reduce((sum: number, order: Order) => sum + order.total, 0)
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
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

          {/* Tabs Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('books')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'books'
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Books Management
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders Management
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'customers'
                    ? 'border-indigo-600 text-indigo-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Customers
              </button>
            </div>
          </div>

          {/* ========== BOOKS MANAGEMENT TAB ========== */}
          {activeTab === 'books' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl text-gray-900 font-semibold">Books Management</h2>
                <button
                  onClick={() => setShowAddBook(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New Book
                </button>
              </div>

              {/* Add/Edit Book Form */}
              {(showAddBook || editingBook) && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg text-gray-900 font-medium mb-4">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title *"
                      value={bookForm.title}
                      onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Author *"
                      value={bookForm.author}
                      onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price *"
                      value={bookForm.price}
                      onChange={(e) => setBookForm({ ...bookForm, price: parseFloat(e.target.value) || 0 })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      step="0.01"
                      required
                    />
                    {/* ✅ Category Dropdown */}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={bookForm.category || ''}
                        onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                        required
                      >
                        <option value="" disabled>▼ Select a category…</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="number"
                      placeholder="Stock *"
                      value={bookForm.stock}
                      onChange={(e) => setBookForm({ ...bookForm, stock: parseInt(e.target.value) || 0 })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="0"
                      required
                    />
                    <input
                      type="url"
                      placeholder="Image URL *"
                      value={bookForm.image}
                      onChange={(e) => setBookForm({ ...bookForm, image: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <textarea
                      placeholder="Description *"
                      value={bookForm.description}
                      onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                      className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      required
                    />
                    <input
                      type="date"
                      placeholder="Published Date"
                      value={bookForm.publishedDate}
                      onChange={(e) => setBookForm({ ...bookForm, publishedDate: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveBook}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Books Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book: BookType) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={book.image} 
                              alt={book.title} 
                              className="w-12 h-16 object-cover rounded"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/60x80?text=No+Image';
                              }}
                            />
                            <span className="text-sm font-medium text-gray-900">{book.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{book.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">${book.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span className={book.stock > 10 ? 'text-green-600' : book.stock > 0 ? 'text-yellow-600' : 'text-red-600'}>
                            {book.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBook(book)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this book?')) {
                                  deleteBook(book.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
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

          {/* ========== ORDERS MANAGEMENT TAB ========== */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 font-semibold">Orders Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order: Order) => {
                      const customer = users.find((u: User) => u.id === order.userId);
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{customer?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 capitalize">{order.paymentMethod}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
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

          {/* ========== CUSTOMERS TAB ========== */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl text-gray-900 font-semibold">Customers</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users
                      .filter((u: User) => !u.isAdmin)
                      .map((user: User) => {
                        const userOrdersCount = orders.filter((o: Order) => o.userId === user.id).length;
                        
                        return (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.phone || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{user.address || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {userOrdersCount} orders
                              </span>
                            </td>
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