const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'AlgoLearn Backend is running!'
  });
});

const PORT = process.env.PORT || 5000;

// Start Express server after attempting DB connection
const startServer = async () => {
  if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('YOUR_MONGODB_ATLAS')) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas authentication/connection failed. Please check username & password in backend/.env');
    }
  } else {
    console.log('MongoDB connection string pending in .env (MONGO_URI)');
  }

  app.listen(PORT, () => {
    console.log(`🚀 AlgoLearn Backend server running on port ${PORT}`);
  });
};

startServer();
