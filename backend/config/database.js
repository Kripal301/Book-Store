// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ Mongoose 8+: Just pass the URI string, no options needed
    // Most options are now defaults
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    
    // Helpful debugging
    if (!process.env.MONGODB_URI) {
      console.error('💡 Hint: MONGODB_URI is undefined - check your .env file');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;