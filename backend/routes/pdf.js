import express from 'express';
import { body } from 'express-validator';
import {
  generateBusinessReport,
  generateInvoice,
  generateInvoicePDF,
  emailInvoice,
  previewBusinessReport
} from '../controllers/pdfController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All PDF routes require authentication
router.use(authenticate);

// Validation middleware for business info
const businessInfoValidation = [
  body('businessInfo.businessName').notEmpty().withMessage('Business name is required'),
  body('businessInfo.email').isEmail().withMessage('Valid email is required'),
  body('businessInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('businessInfo.address').notEmpty().withMessage('Address is required')
];

// Validation middleware for invoice data
const invoiceDataValidation = [
  body('cartItems').isArray().withMessage('Cart items must be an array'),
  body('customerInfo.name').optional().isString(),
  body('customerInfo.email').optional().isEmail().withMessage('Valid email is required'),
  body('totals.total').isNumeric().withMessage('Total amount is required')
];

// Routes
router.post('/business-report', businessInfoValidation, generateBusinessReport);
router.post('/business-report/preview', businessInfoValidation, previewBusinessReport);
router.post('/invoice/:orderId', businessInfoValidation, generateInvoice);

// New routes for billing page
router.post('/generate-invoice', [...businessInfoValidation, ...invoiceDataValidation], generateInvoicePDF);
router.post('/email-invoice', [...businessInfoValidation, ...invoiceDataValidation], emailInvoice);

export default router;