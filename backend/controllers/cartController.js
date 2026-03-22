// controllers/cartController.js
const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get user cart with populated book details
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'cart.book',
        select: 'title author price image stock description'
      });

    // Filter out any books that were deleted (optional cleanup)
    const validCart = user.cart.filter(item => item.book !== null);
    
    // Calculate totals
    const subtotal = validCart.reduce((sum, item) => {
      return sum + (item.book?.price || 0) * item.quantity;
    }, 0);
    
    const totalCount = validCart.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      cart: validCart,
      summary: {
        itemCount: totalCount,
        subtotal: parseFloat(subtotal.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching cart'
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body;
    
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a book ID'
      });
    }

    // Verify book exists and is in stock
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${book.stock} items in stock`
      });
    }

    const user = await User.findById(req.user.id);

    // Check if book already in cart
    const existingItem = user.cart.find(item => 
      item.book.toString() === bookId
    );

    if (existingItem) {
      // Update quantity if already in cart
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock limit
      if (newQuantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${book.stock} items in stock`
        });
      }
      
      existingItem.quantity = newQuantity;
    } else {
      // Add new item to cart
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();

    // Populate and return updated cart
    const updatedUser = await User.findById(req.user.id)
      .populate('cart.book', 'title author price image stock');

    res.status(200).json({
      success: true,
      message: existingItem ? 'Cart quantity updated' : 'Item added to cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to cart'
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:bookId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { bookId } = req.params;
    
    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a quantity'
      });
    }

    const user = await User.findById(req.user.id);

    const cartItem = user.cart.find(item => 
      item.book.toString() === bookId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // If quantity <= 0, remove item
    if (quantity <= 0) {
      user.cart = user.cart.filter(item => 
        item.book.toString() !== bookId
      );
    } else {
      // Check stock availability
      const book = await Book.findById(bookId);
      if (book && quantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${book.stock} items in stock`
        });
      }
      cartItem.quantity = quantity;
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate('cart.book', 'title author price image stock');

    res.json({
      success: true,
      message: quantity <= 0 ? 'Item removed from cart' : 'Cart updated successfully',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:bookId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user.id);

    const itemIndex = user.cart.findIndex(item => 
      item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate('cart.book', 'title author price image');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing from cart'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error clearing cart'
    });
  }
};