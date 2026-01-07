import { seedUsers } from '../utils/seedUsers.js';
import { connectDB } from '../utils/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🌱 Seeding users only...');

connectDB().then(() => {
  seedUsers().then(() => {
    console.log('✅ User seeding completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ User seeding failed:', error);
    process.exit(1);
  });
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
});