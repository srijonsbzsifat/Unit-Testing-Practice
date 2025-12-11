/**
 * Database Test Utilities
 *
 * Reusable utilities for setting up and tearing down MongoDB in tests.
 * Best Practice: DRY (Don't Repeat Yourself) - Extract common database setup logic
 * to avoid duplication across test files.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

/**
 * Connects to an in-memory MongoDB instance for testing
 * @returns {Promise<void>}
 */
const connect = async () => {
  try {
    // Close any existing connections first
    await disconnect();

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  } catch (error) {
    console.error('Failed to connect to in-memory MongoDB:', error);
    throw error;
  }
};

/**
 * Disconnects from MongoDB and stops the in-memory server
 * @returns {Promise<void>}
 */
const disconnect = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
  } catch (error) {
    console.error('Failed to disconnect from in-memory MongoDB:', error);
    throw error;
  }
};

/**
 * Clears all data from all collections
 * Useful for ensuring test isolation
 * @returns {Promise<void>}
 */
const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
};

/**
 * Seeds the database with test data
 * @param {mongoose.Model} Model - The Mongoose model to seed
 * @param {Array<Object>} data - Array of documents to create
 * @returns {Promise<Array>} Created documents
 */
const seedDatabase = async (Model, data) => {
  try {
    return await Model.create(data);
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};

module.exports = {
  connect,
  disconnect,
  clearDatabase,
  seedDatabase,
};
