import express from 'express';
import { body } from 'express-validator';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Validation middleware
const orderValidation = [
  body('products').isArray({ min: 1 }).withMessage('Products array is required and must not be empty'),
  body('products.*.productId').notEmpty().withMessage('Product ID is required'),
  body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customerName').optional().trim(),
  body('customerEmail').optional().isEmail().withMessage('Please provide a valid email')
];

const statusValidation = [
  body('status').isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status')
];

// Routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', orderValidation, createOrder);
router.patch('/:id/status', authorize('admin', 'manager'), statusValidation, updateOrderStatus);

export default router;