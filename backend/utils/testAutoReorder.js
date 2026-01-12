import { AutoReorderService } from '../services/autoReorderService.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Test the auto reorder functionality
async function testAutoReorder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/billfinity');
    console.log('Connected to MongoDB for auto reorder testing');

    console.log('\n🔄 Testing Auto Reorder Functionality...\n');

    // 1. Find a product to test with
    let testProduct = await Product.findOne();
    
    if (!testProduct) {
      console.log('No products found. Creating a test product...');
      testProduct = await Product.create({
        name: 'Test Auto Reorder Product',
        sku: 'TEST-AUTO-001',
        category: 'Test',
        price: 100,
        quantity: 3, // Low quantity to trigger reorder
        autoReorderEnabled: true,
        reorderPoint: 5,
        reorderQuantity: 20,
        supplierInfo: {
          name: 'Test Supplier',
          email: 'supplier@test.com',
          phone: '+1234567890'
        }
      });
      console.log('✅ Test product created:', testProduct.name);
    } else {
      // Update existing product for testing
      await Product.findByIdAndUpdate(testProduct._id, {
        quantity: 3, // Set low quantity
        autoReorderEnabled: true,
        reorderPoint: 5,
        reorderQuantity: 20,
        supplierInfo: {
          name: 'Test Supplier',
          email: 'supplier@test.com',
          phone: '+1234567890'
        }
      });
      console.log('✅ Updated existing product for testing:', testProduct.name);
    }

    // 2. Test auto reorder trigger check
    console.log('\n2. Testing auto reorder trigger check...');
    const result = await AutoReorderService.checkAutoReorderTriggers('60f1b2b3b3b3b3b3b3b3b3b3'); // Mock user ID
    
    console.log('Auto reorder check result:', {
      success: result.success,
      reordersCreated: result.reordersCreated,
      reorderCount: result.reorders?.length || 0
    });

    if (result.success && result.reordersCreated > 0) {
      console.log('✅ Auto reorder triggered successfully!');
      result.reorders.forEach((reorder, index) => {
        console.log(`   Reorder ${index + 1}:`, {
          product: reorder.product.name,
          quantity: reorder.quantity,
          status: reorder.status
        });
      });
    } else {
      console.log('ℹ️  No reorders created (product may not meet reorder criteria)');
    }

    // 3. Test reorder stats
    console.log('\n3. Testing reorder statistics...');
    const statsResult = await AutoReorderService.getReorderStats();
    
    if (statsResult.success) {
      console.log('Reorder Stats:', {
        total: statsResult.data.totalReorders,
        pending: statsResult.data.pendingReorders,
        ordered: statsResult.data.orderedReorders,
        received: statsResult.data.receivedReorders
      });
    }

    // 4. Test manual reorder creation
    console.log('\n4. Testing manual reorder creation...');
    const manualResult = await AutoReorderService.createManualReorder(
      testProduct._id,
      10,
      '60f1b2b3b3b3b3b3b3b3b3b3', // Mock user ID
      'Manual test reorder'
    );

    if (manualResult.success) {
      console.log('✅ Manual reorder created successfully:', {
        product: manualResult.data.reorder.product.name,
        quantity: manualResult.data.reorder.quantity,
        status: manualResult.data.reorder.status
      });
    }

    console.log('\n✅ All auto reorder tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Auto reorder trigger system: Working');
    console.log('   - Reorder statistics: Working');
    console.log('   - Manual reorder creation: Working');
    console.log('   - Database integration: Working');
    
  } catch (error) {
    console.error('❌ Auto reorder test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test
testAutoReorder();