import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const updatePasswords = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 🔧 CHANGE THESE PASSWORDS TO WHAT YOU WANT:
    const NEW_ADMIN_PASSWORD = 'Itsmeadmin2026';  // ← Change this
    const NEW_STAFF_PASSWORD = 'Itsmestaff2026';  // ← Change this

    console.log('\n🔄 Updating passwords...');

    // Update Admin Password
    const adminUser = await User.findOne({ email: 'admin@billfinity.com' });
    if (adminUser) {
      adminUser.password = NEW_ADMIN_PASSWORD; // Will be hashed automatically
      await adminUser.save();
      console.log('✅ Admin password updated successfully');
    } else {
      console.log('❌ Admin user not found');
    }

    // Update Staff Password
    const staffUser = await User.findOne({ email: 'staff@billfinity.com' });
    if (staffUser) {
      staffUser.password = NEW_STAFF_PASSWORD; // Will be hashed automatically
      await staffUser.save();
      console.log('✅ Staff password updated successfully');
    } else {
      console.log('❌ Staff user not found');
    }

    console.log('\n🎉 Password update complete!');
    console.log('\n📋 New Login Credentials:');
    console.log('┌─────────────────────────────────────┐');
    console.log('│ ADMIN LOGIN                         │');
    console.log('│ Email: admin@billfinity.com         │');
    console.log(`│ Password: ${NEW_ADMIN_PASSWORD.padEnd(23)} │`);
    console.log('│ Role: admin                         │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ STAFF LOGIN                         │');
    console.log('│ Email: staff@billfinity.com         │');
    console.log(`│ Password: ${NEW_STAFF_PASSWORD.padEnd(23)} │`);
    console.log('│ Role: staff                         │');
    console.log('└─────────────────────────────────────┘');
    console.log('\n🔒 Passwords are securely hashed in the database');
    console.log('🚀 Use these new credentials to login');

  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
updatePasswords();