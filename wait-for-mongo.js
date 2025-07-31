const mongoose = require('mongoose');

const waitForMongo = async () => {
  const maxRetries = 30;
  const retryDelay = 2000; 
  
  console.log('🔄 Waiting for MongoDB to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://root:password123@mongodb:27017/horoscope_db?authSource=admin';
      console.log(`📡 Attempt ${i + 1}/${maxRetries} - Connecting to MongoDB...`);
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      
      console.log('✅ MongoDB is ready!');
      await mongoose.disconnect();
      return true;
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries - 1) {
        console.error('💥 Failed to connect to MongoDB after maximum retries');
        process.exit(1);
      }
      
      console.log(`⏳ Waiting ${retryDelay/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

if (require.main === module) {
  waitForMongo().then(() => {
    console.log('🚀 Starting main application...');
    require('./server.js');
  });
}

module.exports = waitForMongo;