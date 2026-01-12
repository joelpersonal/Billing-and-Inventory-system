// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../backend/utils/database.js';
import { errorHandler } from '../backend/middleware/errorHandler.js';

// Import routes
import authRoutes from '../backend/routes/auth.js';
import dashboardRoutes from '../backend/routes/dashboard.js';
import productRoutes from '../backend/routes/products.js';
import orderRoutes from '../backend/routes/orders.js';
import pdfRoutes from '../backend/routes/pdf.js';
import aiRoutes from '../backend/routes/ai.js';
import reorderRoutes from '../backend/routes/reorders.js';
import invoiceTimelineRoutes from '../backend/routes/invoiceTimeline.js';

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

export default app;