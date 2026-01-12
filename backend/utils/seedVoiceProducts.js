import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for voice product seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const voiceTestProducts = [
  // Groceries - Common voice command items
  { name: 'Sugar', sku: 'SUGAR-001', category: 'Groceries', price: 45, quantity: 100, description: 'White sugar 1kg pack' },
  { name: 'Rice', sku: 'RICE-001', category: 'Groceries', price: 60, quantity: 80, description: 'Basmati rice 5kg bag' },
  { name: 'Milk', sku: 'MILK-001', category: 'Groceries', price: 30, quantity: 50, description: 'Fresh milk 1 liter' },
  { name: 'Bread', sku: 'BREAD-001', category: 'Groceries', price: 25, quantity: 40, description: 'White bread loaf' },
  { name: 'Eggs', sku: 'EGGS-001', category: 'Groceries', price: 35, quantity: 60, description: 'Fresh eggs dozen' },
  { name: 'Butter', sku: 'BUTTER-001', category: 'Groceries', price: 55, quantity: 30, description: 'Salted butter 500g' },
  { name: 'Cheese', sku: 'CHEESE-001', category: 'Groceries', price: 80, quantity: 25, description: 'Cheddar cheese 200g' },
  { name: 'Yogurt', sku: 'YOGURT-001', category: 'Groceries', price: 40, quantity: 35, description: 'Greek yogurt 500g' },
  { name: 'Chicken', sku: 'CHICKEN-001', category: 'Groceries', price: 120, quantity: 20, description: 'Fresh chicken 1kg' },
  { name: 'Fish', sku: 'FISH-001', category: 'Groceries', price: 150, quantity: 15, description: 'Fresh fish 1kg' },
  
  // Beverages
  { name: 'Tea', sku: 'TEA-001', category: 'Beverages', price: 85, quantity: 45, description: 'Black tea 250g pack' },
  { name: 'Coffee', sku: 'COFFEE-001', category: 'Beverages', price: 120, quantity: 30, description: 'Ground coffee 500g' },
  { name: 'Juice', sku: 'JUICE-001', category: 'Beverages', price: 65, quantity: 40, description: 'Orange juice 1 liter' },
  { name: 'Water', sku: 'WATER-001', category: 'Beverages', price: 20, quantity: 100, description: 'Mineral water 1 liter' },
  { name: 'Soda', sku: 'SODA-001', category: 'Beverages', price: 35, quantity: 60, description: 'Cola 500ml bottle' },
  
  // Snacks
  { name: 'Chips', sku: 'CHIPS-001', category: 'Snacks', price: 45, quantity: 50, description: 'Potato chips 200g pack' },
  { name: 'Cookies', sku: 'COOKIES-001', category: 'Snacks', price: 55, quantity: 40, description: 'Chocolate cookies 300g' },
  { name: 'Nuts', sku: 'NUTS-001', category: 'Snacks', price: 95, quantity: 25, description: 'Mixed nuts 250g pack' },
  { name: 'Chocolate', sku: 'CHOCO-001', category: 'Snacks', price: 75, quantity: 35, description: 'Dark chocolate bar 100g' },
  { name: 'Biscuits', sku: 'BISCUIT-001', category: 'Snacks', price: 40, quantity: 45, description: 'Digestive biscuits 400g' },
  
  // Household
  { name: 'Soap', sku: 'SOAP-001', category: 'Household', price: 25, quantity: 70, description: 'Bath soap 100g bar' },
  { name: 'Shampoo', sku: 'SHAMPOO-001', category: 'Household', price: 85, quantity: 30, description: 'Hair shampoo 400ml' },
  { name: 'Toothpaste', sku: 'TOOTH-001', category: 'Household', price: 45, quantity: 40, description: 'Toothpaste 100g tube' },
  { name: 'Detergent', sku: 'DETERG-001', category: 'Household', price: 95, quantity: 25, description: 'Washing powder 1kg' },
  { name: 'Tissue', sku: 'TISSUE-001', category: 'Household', price: 35, quantity: 60, description: 'Facial tissue box' },
  
  // Fruits & Vegetables
  { name: 'Apples', sku: 'APPLE-001', category: 'Fruits', price: 80, quantity: 50, description: 'Fresh apples 1kg' },
  { name: 'Bananas', sku: 'BANANA-001', category: 'Fruits', price: 40, quantity: 60, description: 'Fresh bananas 1kg' },
  { name: 'Oranges', sku: 'ORANGE-001', category: 'Fruits', price: 70, quantity: 45, description: 'Fresh oranges 1kg' },
  { name: 'Tomatoes', sku: 'TOMATO-001', category: 'Vegetables', price: 50, quantity: 40, description: 'Fresh tomatoes 1kg' },
  { name: 'Onions', sku: 'ONION-001', category: 'Vegetables', price: 35, quantity: 80, description: 'Fresh onions 1kg' },
  { name: 'Potatoes', sku: 'POTATO-001', category: 'Vegetables', price: 30, quantity: 100, description: 'Fresh potatoes 1kg' },
  { name: 'Carrots', sku: 'CARROT-001', category: 'Vegetables', price: 45, quantity: 35, description: 'Fresh carrots 1kg' },
  
  // Spices & Condiments
  { name: 'Salt', sku: 'SALT-001', category: 'Spices', price: 15, quantity: 90, description: 'Table salt 1kg pack' },
  { name: 'Pepper', sku: 'PEPPER-001', category: 'Spices', price: 65, quantity: 30, description: 'Black pepper powder 100g' },
  { name: 'Oil', sku: 'OIL-001', category: 'Cooking', price: 110, quantity: 40, description: 'Cooking oil 1 liter' },
  { name: 'Vinegar', sku: 'VINEGAR-001', category: 'Condiments', price: 35, quantity: 25, description: 'White vinegar 500ml' },
  
  // Free items for testing
  { name: 'Sample', sku: 'SAMPLE-001', category: 'Free', price: 0, quantity: 1000, description: 'Free sample item' },
  { name: 'Coupon', sku: 'COUPON-001', category: 'Free', price: 0, quantity: 500, description: 'Discount coupon' }
];

const seedVoiceProducts = async () => {
  try {
    await connectDB();

    console.log('🎤 Starting voice test products seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Create voice test products
    const products = await Product.create(voiceTestProducts);
    console.log('✅ Voice test products seeded successfully');

    console.log('🎉 Voice products seeding completed!');
    console.log(`📊 Created ${products.length} voice-friendly products`);
    
    // Show some key products for testing
    console.log('\n🧪 Key products for voice testing:');
    const keyProducts = products.filter(p => 
      ['Sugar', 'Rice', 'Milk', 'Tea', 'Coffee'].includes(p.name)
    );
    keyProducts.forEach(p => {
      console.log(`   - ${p.name}: $${p.price} (SKU: ${p.sku})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding voice products:', error);
    process.exit(1);
  }
};

seedVoiceProducts();