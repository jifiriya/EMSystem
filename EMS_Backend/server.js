const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const employeeRoutes = require('./routes/employees');
const dashboardRoutes = require('./routes/dashboard');
const seedDatabase = require('./seed');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  const statusCode = isMongoConnected ? 200 : 503;

  res.status(statusCode).json({
    status: isMongoConnected ? 'ok' : 'error',
    service: 'PulseHR Express API',
    database: isMongoConnected ? 'Connected (MongoDB)' : 'Disconnected',
    timestamp: new Date()
  });
});

// 404 Handler for Unmatched Routes
app.use(notFound);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Database Connection Logic
const initializeDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ CRITICAL ERROR: MONGODB_URI environment variable is missing.');
    console.error('Please configure MONGODB_URI in server/.env file.');
    process.exit(1);
  }

  try {
    console.log(`📡 Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Successfully connected to MongoDB database!');
    await seedDatabase();
  } catch (err) {
    console.error('❌ CRITICAL ERROR: Database Connection Failed.');
    console.error(`Error Details: ${err.message}`);
    console.error('The application requires a working MongoDB database connection to function.');
    process.exit(1);
  }
};

initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌐 Server running on http://localhost:${PORT}`);
  });
});
