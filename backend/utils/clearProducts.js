import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for clearing products...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const clearProducts = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing all products from database...');
    
    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products`);
    
    console.log('🎉 Database cleared! You can now add products through the UI.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
};

clearProducts();