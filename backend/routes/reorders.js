import express from 'express';
import { body } from 'express-validator';
import {
  getAllReorders,
  getReorderStats,
  updateReorderStatus,
  createManualReorder,
  checkAutoReorderTriggers
} from '../controllers/reorderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All reorder routes require authentication
router.use(authenticate);

// Validation middleware
const manualReorderValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('notes').optional().trim()
];

const statusUpdateValidation = [
  body('status').isIn(['pending', 'ordered', 'received', 'cancelled']).withMessage('Invalid status'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('notes').optional().trim()
];

// Routes
router.get('/', getAllReorders);
router.get('/stats', getReorderStats);
router.post('/check-triggers', checkAutoReorderTriggers);
router.post('/manual', authorize('admin', 'manager'), manualReorderValidation, createManualReorder);
router.patch('/:id/status', authorize('admin', 'manager'), statusUpdateValidation, updateReorderStatus);

export default router;