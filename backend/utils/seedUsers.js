import User from '../models/User.js';
import { users } from '../config/users.js';

export const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');
    
    // Create users from config
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role
        });
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }
    
    console.log('🎉 User seeding completed successfully!');
    console.log('\n📋 Available Login Credentials:');
    users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  import('../utils/database.js').then(async ({ connectDB }) => {
    await connectDB();
    seedUsers().then(() => {
      process.exit(0);
    }).catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
  });
}