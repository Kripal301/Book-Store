const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addReview,
  deleteReview
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);

// Protected routes (Admin only)
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

// Protected routes (Authenticated users)
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;