import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Navigate is imported
import HomePage from './pages/HomePage';

const BooksPage = () => <div className="p-8">Books Page</div>;
const WishlistPage = () => <div className="p-8">Wishlist Page</div>;
const CartPage = () => <div className="p-8">Cart Page</div>;
const LoginPage = () => <div className="p-8">Login Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* ✅ Now works */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;