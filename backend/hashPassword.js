// hashPassword.js
// Run this to generate a bcrypt hash for admin password
require('dotenv').config();
const bcrypt = require('bcryptjs');

// 🔧 Change this to your desired admin password
const plainPassword = 'admin123';

const hashPassword = async () => {
  try {
    console.log('🔐 Generating bcrypt hash...');
    console.log('Plain password:', plainPassword);
    
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    console.log('\n✅ Hashed password (copy this):');
    console.log('─────────────────────────────────');
    console.log(hashedPassword);
    console.log('─────────────────────────────────\n');
    
    console.log('💡 Next: Use this hash in MongoDB to create admin user');
    
  } catch (error) {
    console.error('❌ Error hashing password:', error);
  }
};

hashPassword();