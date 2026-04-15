  const Book = require('../models/Book');

  // @desc    Get all books with filters, search, pagination, sorting
  // @route   GET /api/books
  // @access  Public
  exports.getBooks = async (req, res) => {
    try {
      const { 
        category, 
        search, 
        page = 1, 
        limit = 12, 
        sortBy = 'createdAt',
        order = 'desc',
        minPrice,
        maxPrice
      } = req.query;

      // Build query object
      const query = {};

      // Category filter
      if (category && category !== 'All') {
        query.category = category;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // Text search (requires text index)
      if (search) {
        query.$text = { $search: search };
      }

      // Build sort object
      const sortOptions = {};
      const validSortFields = ['title', 'author', 'price', 'rating', 'createdAt', 'publishedDate'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
      sortOptions[sortField] = order === 'asc' ? 1 : -1;

      // Pagination
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 12;
      const skip = (pageNumber - 1) * limitNumber;

      // Execute query
      const books = await Book.find(query)
        .sort(sortOptions)
        .limit(limitNumber)
        .skip(skip)
        .select('-__v'); // Exclude version key

      // Get total count for pagination
      const total = await Book.countDocuments(query);

      res.status(200).json({
        success: true,
        count: books.length,
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
        books
      });
    } catch (error) {
      console.error('Get books error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error fetching books'
      });
    }
  };

  // @desc    Get single book by ID
  // @route   GET /api/books/:id
  // @access  Public
  exports.getBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).select('-__v');

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        book
      });
    } catch (error) {
      // Handle invalid ObjectId
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      console.error('Get book error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error fetching book'
      });
    }
  };

  // @desc    Create new book (Admin only)
  // @route   POST /api/books
  // @access  Private/Admin
    exports.createBook = async (req, res) => {
    try {
      // ✅ BETTER VALIDATION: Allow 0 for numeric fields
      const requiredFields = ['title', 'author', 'image', 'description', 'category', 'publishedDate'];
      
      for (const field of requiredFields) {
        if (!req.body[field]?.toString().trim()) {  // ✅ Only check if truly empty
          return res.status(400).json({
            success: false,
            message: `Please provide ${field}`
          });
        }
      }

      // ✅ Also validate numeric fields separately
      if (typeof req.body.price !== 'number' || req.body.price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a non-negative number'
        });
      }

      if (typeof req.body.stock !== 'number' || req.body.stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock must be a non-negative number'
        });
      }

      const book = await Book.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        book
      });
    } catch (error) {
      console.error('Create book error:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages
        });
      }
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Book with this title already exists'
        });
      }
      
        res.status(500).json({
          success: false,
          message: error.message || 'Server error creating book'
        });
      }
    };
    
  // @desc    Update book (Admin only)
  // @route   PUT /api/books/:id
  // @access  Private/Admin
  exports.updateBook = async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      ).select('-__v');

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        book
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages
        });
      }
      
      console.error('Update book error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error updating book'
      });
    }
  };

  // @desc    Delete book (Admin only)
  // @route   DELETE /api/books/:id
  // @access  Private/Admin
  exports.deleteBook = async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }
      console.error('Delete book error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error deleting book'
      });
    }
  };

  // @desc    Add review to book (Authenticated users only)
  // @route   POST /api/books/:id/reviews
  // @access  Private
  exports.addReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const bookId = req.params.id;

      // Validate input
      if (!rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Please provide rating and comment'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      // ✅ Fix: Convert both to string for comparison
      const existingReview = book.reviews.find(
        review => review.userId.toString() === req.user._id.toString()
      );

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this book'
        });
      }

      // Create review object
      const review = {
        userId: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        comment: comment.trim()
      };

      book.reviews.push(review);
      
      // ✅ Update average rating before saving
      await Book.calculateAverageRating(bookId);
      
      await book.save();

      // Populate the saved review with full user data if needed
      const populatedBook = await Book.findById(bookId).select('-__v');

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        book: populatedBook
      });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error adding review'
      });
    }
  };

  // @desc    Delete review from book (User or Admin)
  // @route   DELETE /api/books/:id/reviews/:reviewId
  // @access  Private
  exports.deleteReview = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      // Find review index
      const reviewIndex = book.reviews.findIndex(
        review => review._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user owns the review or is admin
      const review = book.reviews[reviewIndex];
      const isOwner = review.userId.toString() === req.user._id.toString();
      
      if (!isOwner && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }

      // Remove review
      book.reviews.splice(reviewIndex, 1);
      
      // Update average rating
      await Book.calculateAverageRating(book._id);
      await book.save();

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error deleting review'
      });
    }
  };

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // ✅ Try finding by _id first, then fallback to userId match
    const review = book.reviews.find(
      r => r._id?.toString() === req.params.reviewId ||
           r.userId?.toString() === req.params.reviewId
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();

    await Book.calculateAverageRating(book._id);
    await book.save();

    const updatedBook = await Book.findById(req.params.id).select('-__v');
    res.json({ success: true, message: 'Review updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // ✅ Try finding by _id first, then fallback to userId match
    const reviewIndex = book.reviews.findIndex(
      review => review._id?.toString() === req.params.reviewId ||
                review.userId?.toString() === req.params.reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const review = book.reviews[reviewIndex];
    const isOwner = review.userId.toString() === req.user._id.toString();

    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    book.reviews.splice(reviewIndex, 1);
    await Book.calculateAverageRating(book._id);
    await book.save();

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error deleting review' });
  }
};