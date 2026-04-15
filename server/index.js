require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const menuRoutes = require('./routes/menu.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const reservationRoutes = require('./routes/reservation.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const uploadRoutes = require('./routes/upload.routes');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,  // e.g. https://sinnonnas.vercel.app
].filter(Boolean);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);
socketHandler(io);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🔥 Si Nonna's server running on port ${PORT}`);
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log(`   Socket.io: ws://localhost:${PORT}\n`);
  });
});
