/**
 * Create Admin Account
 * 
 * Standalone script to create or promote an admin account.
 * 
 * Usage:
 *   node scripts/createAdmin.js
 *   node scripts/createAdmin.js --email admin@testdi.com --password Admin123!
 * 
 * If no args, uses ADMIN_EMAIL and ADMIN_PASSWORD from .env
 */
require('dotenv').config();
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');

async function createAdmin() {
  try {
    await connectDB();

    // Parse args or use env
    const args = process.argv.slice(2);
    let email = process.env.ADMIN_EMAIL || 'admin@testdi.com';
    let password = process.env.ADMIN_PASSWORD || 'Admin123!';

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email' && args[i + 1]) email = args[++i];
      if (args[i] === '--password' && args[i + 1]) password = args[++i];
    }

    console.log(`\n🔑 Creating admin account: ${email}`);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Promote to admin if already exists
      if (user.role === 'admin') {
        console.log('✅ User is already an admin!');
      } else {
        user.role = 'admin';
        user.updatedAt = new Date();
        await user.save();
        console.log('✅ User promoted to admin!');
      }
    } else {
      // Create new admin user
      user = new User({
        email,
        username: 'Admin',
        password,
        role: 'admin',
        loginMethod: 'local',
        isGuest: false,
      });
      await user.save();
      console.log('✅ Admin account created!');
    }

    console.log(`   Email: ${email}`);
    console.log(`   Role:  ${user.role}`);
    console.log(`   ID:    ${user._id}\n`);

    await disconnectDB();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
