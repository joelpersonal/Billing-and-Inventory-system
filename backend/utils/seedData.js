import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { seedUsers } from './seedUsers.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};



const seedProducts = () => {
  const categories = ['Electronics', 'Groceries', 'Clothing', 'Books', 'Home & Garden'];
  const products = [];

  // Generate 50 sample products
  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const basePrice = Math.floor(Math.random() * 500) + 10;
    const quantity = Math.floor(Math.random() * 100) + 1;
    
    products.push({
      name: `Product ${i}`,
      sku: `SKU-${String(i).padStart(4, '0')}`,
      category,
      price: basePrice,
      quantity,
      lowStockThreshold: 10,
      description: `Description for Product ${i}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
    });
  }

  return products;
};

const seedOrders = async (users, products) => {
  const orders = [];
  
  // Generate 30 sample orders
  for (let i = 1; i <= 30; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products per order
    const orderProducts = [];
    let totalAmount = 0;

    for (let j = 0; j < numProducts; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const subtotal = randomProduct.price * quantity;
      
      orderProducts.push({
        product: randomProduct._id,
        quantity,
        price: randomProduct.price,
        subtotal
      });
      
      totalAmount += subtotal;
    }

    orders.push({
      orderNumber: `ORD-${Date.now()}-${i}`,
      products: orderProducts,
      totalAmount,
      status: ['completed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
      customerName: `Customer ${i}`,
      customerEmail: `customer${i}@example.com`,
      createdBy: randomUser._id,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
    });
  }

  return orders;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed users from config
    await seedUsers();
    const users = await User.find({});

    // Seed products
    const productData = seedProducts();
    await Product.deleteMany({});
    const products = await Product.create(productData);
    console.log('✅ Products seeded successfully');

    // Seed orders
    const orderData = await seedOrders(users, products);
    await Order.deleteMany({});
    const orders = await Order.create(orderData);
    console.log('✅ Orders seeded successfully');

    console.log('🎉 Database seeding completed!');
    console.log(`📊 Created: ${users.length} users, ${products.length} products, ${orders.length} orders`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();