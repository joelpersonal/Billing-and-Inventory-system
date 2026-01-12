import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import pdfRoutes from './routes/pdf.js';
import aiRoutes from './routes/ai.js';
import reorderRoutes from './routes/reorders.js';
import invoiceTimelineRoutes from './routes/invoiceTimeline.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5173',
    'https://billfinity.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reorders', reorderRoutes);
app.use('/api/timeline', invoiceTimelineRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Billfinity API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Billfinity API Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
    console.log(`📦 Products: http://localhost:${PORT}/api/products`);
    console.log(`🧾 Orders: http://localhost:${PORT}/api/orders`);
    console.log(`📄 PDF: http://localhost:${PORT}/api/pdf`);
    console.log(`🤖 AI: http://localhost:${PORT}/api/ai`);
    console.log(`🔄 Reorders: http://localhost:${PORT}/api/reorders`);
    console.log(`⏰ Timeline: http://localhost:${PORT}/api/timeline`);
  });
}

export default app;
