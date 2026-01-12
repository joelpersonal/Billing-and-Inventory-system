import { InvoiceInsightsService } from '../services/invoiceInsightsService.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Test the insights service
async function testInsights() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/billfinity');
    console.log('Connected to MongoDB for testing');

    // Sample cart items (simulating a real order)
    const sampleCartItems = [
      {
        _id: '60f1b2b3b3b3b3b3b3b3b3b3', // This would be a real product ID
        name: 'Sample Product 1',
        price: 100,
        quantity: 2
      },
      {
        _id: '60f1b2b3b3b3b3b3b3b3b3b4',
        name: 'Sample Product 2', 
        price: 50,
        quantity: 1
      }
    ];

    // Sample order
    const sampleOrder = {
      _id: '60f1b2b3b3b3b3b3b3b3b3b5',
      orderNumber: 'ORD-TEST-001',
      totalAmount: 250,
      customerEmail: 'test@example.com',
      createdAt: new Date()
    };

    console.log('Testing Invoice Insights Service...');
    
    // Test individual functions
    console.log('\n1. Testing profit calculation...');
    const profitInsight = await InvoiceInsightsService.calculateProfitInsight(sampleCartItems);
    console.log('Profit Insight:', profitInsight);

    console.log('\n2. Testing customer pattern analysis...');
    const customerPattern = await InvoiceInsightsService.getCustomerBuyingPattern('test@example.com');
    console.log('Customer Pattern:', customerPattern);

    console.log('\n3. Testing top selling item...');
    const topSellingItem = await InvoiceInsightsService.getTodaysTopSellingItem();
    console.log('Top Selling Item:', topSellingItem);

    console.log('\n4. Testing sales comparison...');
    const salesComparison = await InvoiceInsightsService.getSalesComparison(250);
    console.log('Sales Comparison:', salesComparison);

    console.log('\n5. Testing stock alerts...');
    const stockAlert = await InvoiceInsightsService.getStockAlerts(sampleCartItems);
    console.log('Stock Alert:', stockAlert);

    console.log('\n6. Testing revenue impact...');
    const revenueImpact = await InvoiceInsightsService.getRevenueImpact(250);
    console.log('Revenue Impact:', revenueImpact);

    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testInsights();