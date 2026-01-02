const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const connectionRoutes = require('./routes/connection');
const progressRoutes = require('./routes/progress');
const disputeRoutes = require('./routes/dispute');
const adminRoutes = require('./routes/admin');
const walletRoutes = require('./routes/wallet');
const issueRoutes = require('./routes/issue');

const { authenticateToken } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { schedulePenaltyChecks } = require('./utils/penaltyScheduler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});



// Add error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Initialize Passport
// Serve uploads statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/accountability_partner")
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.error('🔍 Check MONGODB_URI environment variable');
    // Don't exit - let the server start and retry connection
  });

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('progress-update', (data) => {
    socket.to(`user-${data.partnerId}`).emit('partner-progress', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', authenticateToken, profileRoutes);
app.use('/api/connections', authenticateToken, connectionRoutes);
// Removed obsolete agreements routes after rebrand to CivicSync
// Removed obsolete payments routes tied to agreements
app.use('/api/progress', authenticateToken, progressRoutes);
app.use('/api/disputes', authenticateToken, disputeRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/issues', issueRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
console.log(`🔧 Attempting to start server on port ${PORT}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🗄️ MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'NOT CONFIGURED'}`);
console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'NOT CONFIGURED'}`);
console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log(`🔌 Listening on 0.0.0.0:${PORT}`);

  const maskedKey = (process.env.RAZORPAY_KEY_ID || '').slice(0, 8) || 'unset';
  console.log(`💳 Razorpay key: ${maskedKey}...`);

  // Start penalty scheduler
  schedulePenaltyChecks();
  console.log(`✅ Server is ready to accept requests`);
});

module.exports = { app, server, io };


