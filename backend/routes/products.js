import express from 'express';
import { body } from 'express-validator';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All product routes require authentication
router.use(authenticate);

// Validation middleware
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Low stock threshold must be a non-negative integer')
];

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authorize('admin', 'manager'), productValidation, createProduct);
router.put('/:id', authorize('admin', 'manager'), productValidation, updateProduct);
router.delete('/:id', authorize('admin', 'manager'), deleteProduct);

export default router;