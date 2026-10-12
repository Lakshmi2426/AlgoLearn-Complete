const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows local ISP DNS SRV lookup failure (querySrv ECONNREFUSED) for mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI is not set. AlgoLearn is running in local persistent JSON storage mode.');
    return null;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Error (${error.message}). Falling back to local persistent JSON storage mode.`);
    return null;
  }
};

module.exports = connectDB;
