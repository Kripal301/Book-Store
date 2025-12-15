import React from "react";
import {
  BookOpen,
  Truck,
  Shield,
  HeadphonesIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { BookCard } from "./BookCard";

interface HomePageProps {
  onNavigate: (page: string, bookId?: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const { books } = useApp();

  // Get newest books (last 4)
  const newBooks = [...books]
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime(),
    )
    .slice(0, 4);

  // Get featured books (highest rated)
  const featuredBooks = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl mb-4">
              Welcome to BookStore
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Discover your next favorite book from our curated
              collection
            </p>
            <button
              onClick={() => onNavigate("books")}
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Browse Books
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-gray-900">
              New Arrivals
            </h2>
            <button
              onClick={() => onNavigate("books")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={(id) =>
                  onNavigate("book-details", id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-gray-900">
              Featured Books
            </h2>
            <button
              onClick={() => onNavigate("books")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewDetails={(id) =>
                  onNavigate("book-details", id)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">
            Join Our Book Community
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            Sign up today and get exclusive deals and
            recommendations
          </p>
          <button
            onClick={() => onNavigate("signup")}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};