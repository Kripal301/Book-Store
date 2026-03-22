// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ✅ STEP 1: Define cartItemSchema FIRST (before userSchema uses it)
const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // Don't create _id for subdocuments

// ✅ STEP 2: Now define userSchema (cartItemSchema is already available)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    // ✅ Now this works - cartItemSchema is defined above!
    cart: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// ✅ SIMPLER: Async function without calling next()
userSchema.pre('save', async function() {
  // Only hash password if it's modified (or new)
  if (!this.isModified('password')) {
    return;  // Just return, don't call next()
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // ✅ Don't call next() - Mongoose handles async completion automatically
});

// ✅ STEP 4: Get cart total price (requires populated books)
userSchema.methods.getCartTotal = function() {
  return this.cart.reduce((total, item) => {
    const price = item.book?.price || 0;
    return total + price * item.quantity;
  }, 0);
};

// ✅ STEP 5: Get cart item count
userSchema.methods.getCartCount = function() {
  return this.cart.reduce((count, item) => count + item.quantity, 0);
};

// ✅ STEP 6: Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ STEP 7: Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ✅ STEP 8: Export the model
module.exports = mongoose.model('User', userSchema);