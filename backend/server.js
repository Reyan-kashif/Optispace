const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const facilityRoutes = require('./routes/facilities');
const bookingRoutes = require('./routes/bookings');
const recommendationRoutes = require('./routes/recommendations');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: null,
    message: 'OptiSpace API is running.',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    data: null,
    message: 'Internal server error.',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`OptiSpace server running on port ${PORT}`);
});

module.exports = app;
