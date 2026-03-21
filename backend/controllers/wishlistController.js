const User = require('../models/User');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title author price image rating stock');

    res.json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching wishlist'
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    // Check if already in wishlist
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({
        success: false,
        message: 'Book already in wishlist'
      });
    }

    user.wishlist.push(bookId);
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('wishlist', 'title author price image rating stock');

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding to wishlist'
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: bookId }
    });

    const user = await User.findById(userId)
      .populate('wishlist', 'title author price image rating stock');

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error removing from wishlist'
    });
  }
};