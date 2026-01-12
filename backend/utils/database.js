import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // MongoDB connection options for Atlas
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    
    // More specific error messages for common Atlas issues
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Check your MongoDB Atlas username and password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Check your MongoDB Atlas connection string and network access');
    } else if (error.message.includes('timeout')) {
      console.error('⏱️ Connection timeout - check your network and Atlas cluster status');
    }
    
    process.exit(1);
  }
};