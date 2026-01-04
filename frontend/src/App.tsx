import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Navigate is imported
import HomePage from './pages/HomePage';
import BooksPage from './pages/BookPage';
import { Navbar } from './components/Navbar';
import BookDetailsPage from './pages/BookDetailsPage';

const WishlistPage = () => <div className="p-8">Wishlist Page</div>;
const CartPage = () => <div className="p-8">Cart Page</div>;
const LoginPage = () => <div className="p-8">Login Page</div>;

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
       <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
       <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/books"
          element={<BooksPage searchQuery={searchQuery} />}
        />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />

      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;