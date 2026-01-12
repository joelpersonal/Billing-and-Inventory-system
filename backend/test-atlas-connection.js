// Test MongoDB Atlas Connection
// Run this file to test your Atlas connection before starting the main app

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');
  
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in .env file');
    console.log('📝 Please add your Atlas connection string to .env file');
    process.exit(1);
  }

  // Check if it's still the placeholder
  if (process.env.MONGODB_URI.includes('YOUR_PASSWORD')) {
    console.log('❌ Please replace YOUR_PASSWORD in MONGODB_URI with your actual password');
    console.log('📝 Your connection string should look like:');
    console.log('   mongodb+srv://billfinity-admin:ACTUAL_PASSWORD@billfinity-cluster...');
    process.exit(1);
  }

  console.log('📡 Connection String Found');
  console.log('🔗 Attempting to connect to Atlas...\n');

  try {
    // Connection options for Atlas
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Test a simple operation
    console.log('\n🧪 Testing database operations...');
    
    // Try to list collections (this will create the database if it doesn't exist)
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Existing collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      console.log('📋 No collections yet (this is normal for new databases)');
    }
    
    console.log('\n🎉 Atlas connection test PASSED!');
    console.log('✅ Your application is ready to use MongoDB Atlas');
    console.log('🚀 You can now start your backend with: npm start');
    
  } catch (error) {
    console.log('❌ Connection FAILED');
    console.log('🔍 Error details:', error.message);
    
    // Provide specific help based on error type
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 SOLUTION:');
      console.log('   1. Check your password in the connection string');
      console.log('   2. Make sure there are no extra spaces');
      console.log('   3. Password is case-sensitive');
      console.log('   4. If password has special characters, it might need URL encoding');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('\n💡 SOLUTION:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify Network Access in Atlas dashboard');
      console.log('   3. Make sure 0.0.0.0/0 is in IP Access List');
      console.log('   4. Wait 2-3 minutes after making Atlas changes');
    } else if (error.message.includes('bad auth')) {
      console.log('\n💡 SOLUTION:');
      console.log('   1. Check username and password are correct');
      console.log('   2. Make sure database user exists in Atlas');
      console.log('   3. Verify user has proper permissions');
    }
    
    console.log('\n📚 For more help, see: docs/MONGODB_ATLAS_STEP_BY_STEP.md');
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
};

// Run the test
testConnection();