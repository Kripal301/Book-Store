import React from "react";
const HomePage = () => {
  // Mock book data — replace with real data later
  const mockBooks = [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 14.99,
      rating: 4.5,
      imageLink: "https://m.media-amazon.com/images/I/71ls-I6A5KL._AC_UF894,1000_QL80_.jpg",
    },
    {
      id: "2",
      title: "Atomic Habits",
      author: "James Clear",
      price: 12.99,
      rating: 4.8,
      imageLink: "https://media.thuprai.com/front_covers/atomic-habits-f.jpg",
    },
    {
      id: "3",
      title: "Dune",
      author: "Frank Herbert",
      price: 16.99,
      rating: 4.6,
      imageLink: "https://booksmandala.com/_next/image?url=https%3A%2F%2Fbooks.bizmandala.com%2Fmedia%2Fbooks%2F9780441172719%2Fimage.jpeg&w=3840&q=75",
    },
    {
      id: "4",
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: 15.99,
      rating: 4.7,
      imageLink: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1764703833i/54493401.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl mb-4">Welcome to BookStore</h1>
            <p className="text-xl mb-8 text-indigo-100">
              Discover your next favorite book from our curated collection
            </p>
            <button
              onClick={() => alert("Browse Books clicked!")}
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
            <h2 className="text-3xl text-gray-900">New Arrivals</h2>
            <button
              onClick={() => alert("View All Books clicked!")}
              className="text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Book Image */}
                <div className="h-64 overflow-hidden">
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{book.author}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-indigo-600 font-semibold">
                      ${book.price}
                    </span>
                    <span className="text-yellow-500">★ {book.rating}</span>
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div className="flex-grow"></div>

                  <button
                    onClick={() => alert(`View details for ${book.title}`)}
                    className="mt-3 w-full py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Join Our Book Community</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Sign up today and get exclusive deals and recommendations
          </p>
          <button
            onClick={() => alert("Sign Up clicked!")}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
