import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      // Lazy-load dev dependency only when needed
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      // Expose for potential teardown in tests
      global.__MONGOD__ = mongod;
      logger.info('Started in-memory MongoDB instance for development/testing');
    }

    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw new Error(`Error: ${error.message}`);
  }
};

export default connectDB;