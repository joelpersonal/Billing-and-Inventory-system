import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const createDefaultUsers = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if users already exist
    const existingAdmin = await User.findOne({ email: 'admin@billfinity.com' });
    const existingStaff = await User.findOne({ email: 'staff@billfinity.com' });

    if (existingAdmin && existingStaff) {
      console.log('ℹ️  Default users already exist');
      console.log('👤 Admin: admin@billfinity.com');
      console.log('👤 Staff: staff@billfinity.com');
      process.exit(0);
    }

    // Create Admin User
    if (!existingAdmin) {
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@billfinity.com',
        password: 'admin123', // This will be hashed automatically
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@billfinity.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create Staff User
    if (!existingStaff) {
      const staffUser = await User.create({
        name: 'Staff User',
        email: 'staff@billfinity.com',
        password: 'staff123', // This will be hashed automatically
        role: 'staff'
      });
      console.log('✅ Staff user created successfully');
      console.log('📧 Email: staff@billfinity.com');
      console.log('🔑 Password: staff123');
    } else {
      console.log('ℹ️  Staff user already exists');
    }

    console.log('\n🎉 Default users setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('┌─────────────────────────────────────┐');
    console.log('│ ADMIN LOGIN                         │');
    console.log('│ Email: admin@billfinity.com         │');
    console.log('│ Password: admin123                  │');
    console.log('│ Role: admin                         │');
    console.log('├─────────────────────────────────────┤');
    console.log('│ STAFF LOGIN                         │');
    console.log('│ Email: staff@billfinity.com         │');
    console.log('│ Password: staff123                  │');
    console.log('│ Role: staff                         │');
    console.log('└─────────────────────────────────────┘');
    console.log('\n🌐 These users are now saved in your MongoDB Atlas database');
    console.log('🚀 Anyone can login with these credentials after deployment');

  } catch (error) {
    console.error('❌ Error creating default users:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Check your MongoDB Atlas username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Check your MongoDB Atlas connection string');
    }
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createDefaultUsers();