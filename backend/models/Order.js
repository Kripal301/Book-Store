const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  title: String,
  author: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['COD', 'eSewa', 'Khalti', 'Credit Card', 'Debit Card', 'PayPal']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for user orders lookup
orderSchema.index({ userId: 1, date: -1 });

// Virtual for user details
orderSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Middleware to populate user details
orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.book',
    select: 'title author price image'
  });
  next();
});

module.exports = mongoose.model('Order', orderSchema);