// src/pages/AdminPage.tsx
import React, { useState } from "react";
import {
  Book,
  Users,
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Book as BookType, Order, User, CreateBookInput } from "../types";
import toast from "react-hot-toast";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}
const formatDate = (dateInput: string | Date | undefined | null): string => {
  if (!dateInput) return "N/A";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid Date";

  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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
    users,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"books" | "orders" | "customers">(
    "books"
  );
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);

  // ✅ Form state for adding/editing books
  const [bookForm, setBookForm] = useState<Partial<CreateBookInput>>({
    title: "",
    author: "",
    price: 0,
    image: "",
    description: "",
    category: "",
    stock: 0,
    rating: 0,
    reviews: [],
    publishedDate: new Date().toISOString().split("T")[0],
  });
  // ✅ Categories for dropdown
  const CATEGORIES = [
    "Fiction",
    "Self-Help",
    "Science",
    "Mystery",
    "Fantasy",
    "Biography",
    "History",
    "Science Fiction",
    "Romance",
    "Thriller",
    "Business",
    "Other",
  ] as const;

  // ✅ Admin access check
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access Denied</p>
          <button
            onClick={() => onNavigate("home")}
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
        toast.success("Book updated successfully!"); // ✅ add
        setEditingBook(null);
      } else {
        // ✅ VALIDATE FRONTEND DATA BEFORE SENDING
        const requiredFields = {
          title: bookForm.title?.trim() || "",
          author: bookForm.author?.trim() || "",
          price: bookForm.price != null ? Number(bookForm.price) : 0,
          image:
            bookForm.image?.trim() ||
            "https://placehold.co/400x600?text=No+Image",
          description: bookForm.description?.trim() || "",
          category:
            bookForm.category &&
            CATEGORIES.includes(
              bookForm.category as (typeof CATEGORIES)[number]
            )
              ? (bookForm.category as string)
              : "Other",
          stock: bookForm.stock != null ? Number(bookForm.stock) : 0,
          publishedDate:
            bookForm.publishedDate?.trim() ||
            new Date().toISOString().split("T")[0],
        };

        // ✅ Check for missing required fields on frontend
        const missingFields = Object.entries(requiredFields)
          .filter(([key, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
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
          rating: 0, // Backend doesn't validate this field
          reviews: [], // Backend doesn't validate this field
          publishedDate: requiredFields.publishedDate,
          featured: bookForm.featured ?? false,
        };

        console.log("🔍 Sending book data:", newBookData); // 🔴 Debug log
        await addBook(newBookData);
        toast.success("Book added successfully!"); // ✅ add
        setShowAddBook(false);
      }

      // Reset form
      setBookForm({
        title: "",
        author: "",
        price: 0,
        image: "",
        description: "",
        category: "",
        stock: 0,
        rating: 0,
        reviews: [],
        publishedDate: new Date().toISOString().split("T")[0],
      });
    } catch (err: any) {
      console.error("Error saving book:", err);
      toast.error(err.message || "Failed to save book. Please try again.");
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
      title: "",
      author: "",
      price: 0,
      image: "",
      description: "",
      category: "",
      stock: 0,
      rating: 0,
      reviews: [],
      publishedDate: new Date().toISOString().split("T")[0],
    });
  };

  // ✅ Stats calculation
  const stats = {
    totalBooks: books.length,
    totalOrders: orders.length,
    totalCustomers: users.filter((u: User) => !u.isAdmin).length,
    totalRevenue: orders
      .filter((order: Order) => order.status === "delivered")
      .reduce((sum: number, order: Order) => sum + order.total, 0),
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
                <p className="text-2xl text-gray-900 mt-1">
                  {stats.totalBooks}
                </p>
              </div>
              <Book className="w-12 h-12 text-indigo-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl text-gray-900 mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl text-gray-900 mt-1">
                  {stats.totalCustomers}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl text-gray-900 mt-1">
                  NRs.{stats.totalRevenue.toFixed(2)}
                </p>
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
              onClick={() => setActiveTab("books")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "books"
                  ? "border-indigo-600 text-indigo-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Books Management
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "orders"
                  ? "border-indigo-600 text-indigo-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === "customers"
                  ? "border-indigo-600 text-indigo-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* ========== BOOKS MANAGEMENT TAB ========== */}
        {activeTab === "books" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl text-gray-900 font-semibold">
                Books Management
              </h2>
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
                  {editingBook ? "Edit Book" : "Add New Book"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Great Gatsby"
                      value={bookForm.title}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, title: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Author */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Author <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. F. Scott Fitzgerald"
                      value={bookForm.author}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, author: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                      <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium border-r border-gray-300 whitespace-nowrap">
                        NRs.
                      </span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={bookForm.price}
                        onChange={(e) =>
                          setBookForm({
                            ...bookForm,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="flex-1 px-4 py-2 focus:outline-none"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={bookForm.category || ""}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, category: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a category…
                      </option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Stock <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                      <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium border-r border-gray-300 whitespace-nowrap">
                        Qty
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={bookForm.stock}
                        onChange={(e) =>
                          setBookForm({
                            ...bookForm,
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        className="flex-1 px-4 py-2 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Image URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={bookForm.image}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, image: e.target.value })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      placeholder="Write a short description of the book…"
                      value={bookForm.description}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          description: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>

                  {/* Published Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={bookForm.publishedDate}
                      onChange={(e) =>
                        setBookForm({
                          ...bookForm,
                          publishedDate: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex flex-col gap-1 justify-end">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Featured Book
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={bookForm.featured || false}
                          onChange={(e) =>
                            setBookForm({
                              ...bookForm,
                              featured: e.target.checked,
                            })
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-10 h-6 rounded-full transition-colors ${
                            bookForm.featured ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                        />
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                            bookForm.featured
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-700">
                        {bookForm.featured
                          ? "Yes, show in featured section"
                          : "No, regular listing only"}
                      </span>
                    </label>
                  </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
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
                              (e.currentTarget as HTMLImageElement).src =
                                "https://placehold.co/60x80?text=No+Image";
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {book.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        Nrs.{book.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span
                          className={
                            book.stock > 10
                              ? "text-green-600"
                              : book.stock > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
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
                            onClick={async () => {
                              toast(
                                (t) => (
                                  <div className="flex flex-col gap-2">
                                    <p className="font-medium text-gray-900">
                                      Delete "{book.title}"?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      This action cannot be undone.
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                      <button
                                        onClick={async () => {
                                          toast.dismiss(t.id);
                                          try {
                                            await deleteBook(book.id);
                                            toast.success(
                                              "Book deleted successfully!"
                                            );
                                          } catch (err: any) {
                                            toast.error(
                                              err.message ||
                                                "Failed to delete book."
                                            );
                                          }
                                        }}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => toast.dismiss(t.id)}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ),
                                { duration: Infinity }
                              );
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
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900 font-semibold">
                Orders Management
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books Ordered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: Order) => {
                    // order.userId is a populated object from backend, use it directly
                    const customer =
                      typeof order.userId === "object"
                        ? (order.userId as unknown as {
                            _id: string;
                            name: string;
                            email: string;
                          })
                        : null;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-900">
                          {order.id}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {customer?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {customer?.email || "No email"}
                            </span>
                          </div>
                        </td>
                        {/* ✅ NEW - Books Ordered */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-8 h-11 object-cover rounded shadow-sm flex-shrink-0"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      "https://placehold.co/32x44?text=N/A";
                                  }}
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-medium text-gray-900 truncate max-w-[140px]">
                                    {item.title}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    x{item.quantity} · NRs.
                                    {(
                                      (item.price ?? 0) * item.quantity
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(order.date)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          NRs.{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                          {order.paymentMethod}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              try {
                                await updateOrderStatus(
                                  order.id,
                                  e.target.value as Order["status"]
                                );
                                toast.success(
                                  `Order status updated to ${e.target.value}`
                                );
                              } catch (err: any) {
                                toast.error(
                                  err.message ||
                                    "Failed to update order status."
                                );
                              }
                            }}
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
        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900 font-semibold">Customers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter((u: User) => !u.isAdmin)
                    .map((user: User) => {
                      const userOrdersCount = orders.filter((o: Order) => {
                        const orderId =
                          typeof o.userId === "object"
                            ? (o.userId as any)._id?.toString()
                            : o.userId?.toString();
                        return orderId === user.id?.toString();
                      }).length;

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {user.phone || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {user.address || "N/A"}
                          </td>
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
