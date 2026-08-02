const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 2,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 60000,
      waitQueueTimeoutMS: 8000,
      family: 4,
    };
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance.connection;
        console.log(`MongoDB Connected: ${cached.conn.host}`);
        return cached.conn;
      });
  }

  try {
    await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`DB connect error: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
