const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const rateLimit = require('express-rate-limit');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const departmentRoutes = require('./routes/departments');
const employeeRoutes = require('./routes/employees');
const dashboardRoutes = require('./routes/dashboard');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Rate limiting for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per window per IP
  message: { success: false, message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman) or matching allowed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy blocked access from origin: ' + origin));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/update-password', authLimiter);
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
  } catch (err) {
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
