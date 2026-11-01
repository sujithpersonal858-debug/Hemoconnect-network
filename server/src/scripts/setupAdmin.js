/**
 * HemoConnect Secure Administrator Provisioning Script
 *
 * Usage:
 *   node src/scripts/setupAdmin.js [email] [password] [name]
 *
 * Or via environment variables:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node src/scripts/setupAdmin.js
 *
 * This script hashes the administrator password using bcrypt via the Mongoose schema,
 * creates or updates the admin account in MongoDB, and exits safely.
 *
 * Security Note: Never commit production passwords or credentials to source control.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const setupAdmin = async () => {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@hemoconnect.gov.in';
  const rawPassword = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'HemoConnect National Administrator';

  if (!rawPassword) {
    console.error('❌ Error: Administrator password must be provided.');
    console.error('Usage: node src/scripts/setupAdmin.js <email> <password> [name]');
    console.error('Example: node src/scripts/setupAdmin.js admin@hemoconnect.gov.in AdminSecure#2026');
    process.exit(1);
  }

  if (rawPassword.length < 8) {
    console.error('❌ Error: Admin password must be at least 8 characters long for production security.');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    console.log('Connecting securely to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB database.');

    const normalizedEmail = email.toLowerCase().trim();
    let adminUser = await User.findOne({ email: normalizedEmail });

    if (adminUser) {
      console.log(`ℹ️ Existing account found for ${normalizedEmail}. Updating password and ensuring admin role...`);
      adminUser.name = name;
      adminUser.role = 'admin';
      adminUser.isVerified = true;
      adminUser.password = rawPassword; // Will be hashed by userSchema.pre('save')
      await adminUser.save();
      console.log(`✅ Administrator account updated successfully.`);
    } else {
      console.log(`Creating new Administrator account for ${normalizedEmail}...`);
      adminUser = await User.create({
        name,
        email: normalizedEmail,
        password: rawPassword, // Will be hashed by userSchema.pre('save')
        role: 'admin',
        phone: '+91 11 2306 1234',
        state: 'Telangana',
        district: 'Hyderabad',
        isVerified: true
      });
      console.log(`✅ Administrator account created successfully with ID: ${adminUser._id}`);
    }

    console.log('----------------------------------------------------');
    console.log(`Role: ${adminUser.role}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Verification: Verified Active (System Authority)`);
    console.log('Security: Password hashed with bcrypt (salt rounds: 10)');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Failed to provision administrator account:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected safely.');
    process.exit(0);
  }
};

setupAdmin();
