import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

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

const testVoiceProducts = async () => {
  try {
    await connectDB();

    console.log('🧪 Testing voice products in database...\n');

    // Test key products for voice commands
    const testProducts = ['Sugar', 'Rice', 'Milk', 'Tea', 'Coffee'];
    
    for (const productName of testProducts) {
      const product = await Product.findOne({ 
        name: { $regex: new RegExp(productName, 'i') } 
      });
      
      if (product) {
        console.log(`✅ ${productName}:`);
        console.log(`   - ID: ${product._id}`);
        console.log(`   - Name: ${product.name}`);
        console.log(`   - Price: $${product.price}`);
        console.log(`   - SKU: ${product.sku}`);
        console.log(`   - Quantity: ${product.quantity}`);
        console.log(`   - Category: ${product.category}\n`);
      } else {
        console.log(`❌ ${productName}: Not found in database\n`);
      }
    }

    // Test API-like query (similar to what frontend does)
    console.log('🔍 Testing API-like product query...');
    const allProducts = await Product.find({}).limit(10);
    console.log(`📦 Found ${allProducts.length} products total`);
    
    console.log('\n📋 First 5 products:');
    allProducts.slice(0, 5).forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name} - $${p.price} (${p.sku})`);
    });

    // Test voice matching simulation
    console.log('\n🎤 Simulating voice command matching...');
    const voiceCommands = ['sugar', 'rice', 'milk'];
    
    for (const command of voiceCommands) {
      const matches = await Product.find({
        name: { $regex: new RegExp(command, 'i') }
      });
      
      console.log(`\n"${command}" matches:`);
      matches.forEach(match => {
        console.log(`   - ${match.name} ($${match.price})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing voice products:', error);
    process.exit(1);
  }
};

testVoiceProducts();