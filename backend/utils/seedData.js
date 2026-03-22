const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Clearing existing data...');
    await Book.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Seed books
    const books = await Book.create([
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1764337500043-e9171c903617',
        description: 'A dazzling novel about all the choices that go into a life well lived.',
        category: 'Fiction',
        stock: 45,
        rating: 4.5,
        publishedDate: '2025-10-01'
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd',
        description: 'An easy and proven way to build good habits and break bad ones.',
        category: 'Self-Help',
        stock: 30,
        rating: 4.8,
        publishedDate: '2025-09-15'
      },
      // Add all your mock books here...
    ]);

    console.log('✅ Books seeded');

    // Seed users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@bookstore.com',
        password: 'admin123',
        isAdmin: true,
        address: '123 Admin Street, City',
        phone: '+1234567890'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'user123',
        isAdmin: false,
        address: '456 User Avenue, Town',
        phone: '+1234567891'
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'user123',
        isAdmin: false,
        address: '789 Reader Lane, Village',
        phone: '+1234567892'
      }
    ]);

    console.log('✅ Users seeded');

    // Seed orders
    await Order.create([
      {
        userId: users[1]._id,
        items: [
          { book: books[0]._id, title: books[0].title, author: books[0].author, price: books[0].price, image: books[0].image, quantity: 1 },
          { book: books[1]._id, title: books[1].title, author: books[1].author, price: books[1].price, image: books[1].image, quantity: 2 }
        ],
        total: 84.97,
        deliveryAddress: '456 User Avenue, Town',
        paymentMethod: 'eSewa',
        status: 'delivered',
        date: '2025-11-10'
      }
      // Add more orders...
    ]);

    console.log('✅ Orders seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();