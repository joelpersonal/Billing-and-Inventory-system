import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AutoReorderService } from './services/autoReorderService.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for testing...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const testManualReorder = async () => {
  try {
    await connectDB();

    console.log('🧪 Testing Manual Reorder Functionality...\n');

    // Get a test product
    const testProduct = await Product.findOne({ name: 'Sugar' });
    if (!testProduct) {
      console.log('❌ No test product found. Please run seed data first.');
      process.exit(1);
    }

    // Get a test user
    const testUser = await User.findOne({ email: 'admin@billfinity.com' });
    if (!testUser) {
      console.log('❌ No test user found. Please run seed data first.');
      process.exit(1);
    }

    console.log('📦 Test Product:', testProduct.name);
    console.log('👤 Test User:', testUser.email);
    console.log('🔍 Current Stock:', testProduct.quantity);

    // Test manual reorder creation
    console.log('\n🔄 Creating manual reorder...');
    const result = await AutoReorderService.createManualReorder(
      testProduct._id,
      50, // quantity
      testUser._id,
      'Test manual reorder from script'
    );

    if (result.success) {
      console.log('✅ Manual reorder created successfully!');
      console.log('📋 Reorder Details:');
      console.log('   - Product:', result.data.reorder.product.name);
      console.log('   - Quantity:', result.data.reorder.quantity);
      console.log('   - Trigger:', result.data.reorder.triggerReason);
      console.log('   - Status:', result.data.reorder.status);
      console.log('   - Notes:', result.data.reorder.notes);
    } else {
      console.log('❌ Failed to create manual reorder:', result.error);
    }

    // Test getting reorders
    console.log('\n📋 Fetching all reorders...');
    const reordersResult = await AutoReorderService.getReorders();
    
    if (reordersResult.success) {
      console.log('✅ Reorders fetched successfully!');
      console.log('📊 Total reorders:', reordersResult.data.pagination.totalReorders);
      
      const manualReorders = reordersResult.data.reorders.filter(r => r.triggerReason === 'manual');
      console.log('🔧 Manual reorders:', manualReorders.length);
      
      if (manualReorders.length > 0) {
        console.log('\n🔧 Recent manual reorders:');
        manualReorders.slice(0, 3).forEach((reorder, index) => {
          console.log(`   ${index + 1}. ${reorder.product.name} - ${reorder.quantity} units (${reorder.status})`);
        });
      }
    } else {
      console.log('❌ Failed to fetch reorders:', reordersResult.error);
    }

    // Test reorder stats
    console.log('\n📊 Fetching reorder stats...');
    const statsResult = await AutoReorderService.getReorderStats();
    
    if (statsResult.success) {
      console.log('✅ Stats fetched successfully!');
      console.log('📈 Reorder Statistics:');
      console.log('   - Total:', statsResult.data.totalReorders);
      console.log('   - Pending:', statsResult.data.pendingReorders);
      console.log('   - Ordered:', statsResult.data.orderedReorders);
      console.log('   - Received:', statsResult.data.receivedReorders);
    } else {
      console.log('❌ Failed to fetch stats:', statsResult.error);
    }

    console.log('\n🎉 Manual reorder test completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing manual reorder:', error);
    process.exit(1);
  }
};

testManualReorder();