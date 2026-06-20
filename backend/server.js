const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env configuration variables
dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Establish database connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors()); // Permits cross-origin resource sharing
app.use(express.json()); // Body parser for incoming JSON requests payloads

// Log API hits in dev mode console output tracing
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// REST Api routing mounts
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Fallback Route Handler: catch-all 404 errors for undefined endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Requested route path URL [${req.method} ${req.originalUrl}] not found on server`,
  });
});

// Global Express Error interceptor custom middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server successfully started running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown: captures unhandled promise rejections and closes connections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Promise Rejection Error: ${err.message}`);
  // Close database connections & server gracefully before terminating (reloaded port configurations)
  server.close(() => process.exit(1));
});
