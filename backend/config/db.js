const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_reuse';

  try {
    // First, attempt connecting to the configured / local MongoDB URI
    console.log(`Connecting to MongoDB at: ${primaryUri}...`);
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500 // Fail fast if local daemon isn't running
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryErr) {
    console.warn(`\n  Local/Configured MongoDB connection failed: ${primaryErr.message}`);
    console.log('⚡ Launching embedded zero-config MongoDB instance (MongoMemoryServer)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(` Embedded MongoDB Active: ${conn.connection.host}`);
      console.log(' Zero-setup database initialized seamlessly for demonstration!\n');
      return conn;
    } catch (memErr) {
      console.error(' Embedded MongoDB launch failed:', memErr.message);
      console.error('\nPlease ensure either:');
      console.error('1. A MongoDB server is running locally (mongodb://127.0.0.1:27017)');
      console.error('2. A valid MONGODB_URI is provided in backend/.env');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
