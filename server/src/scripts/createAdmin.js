const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');

dotenv.config();

const createAdminAccount = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI is not set in environment. Set it in .env first.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected.');

    const adminEmail = process.argv[2] || 'admin@hemoconnect.org';
    const adminPassword = process.argv[3] || 'HemoAdmin2026!';
    const adminName = 'Sujithkodali';

    let user = await User.findOne({ email: adminEmail });
    if (user) {
      user.role = 'admin';
      user.isVerified = true;
      user.password = adminPassword;
      await user.save();
      console.log(`✅ Existing user updated to Administrator: ${adminEmail}`);
    } else {
      user = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '+91 99999 00000',
        state: 'Telangana',
        district: 'Hyderabad',
        isVerified: true
      });
      console.log(`✅ Administrator account created: ${adminEmail}`);
    }

    console.log('Credentials:');
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdminAccount();
