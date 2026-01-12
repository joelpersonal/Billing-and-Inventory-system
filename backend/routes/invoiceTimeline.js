import express from 'express';
import { body } from 'express-validator';
import {
  getInvoiceTimeline,
  getTimelineByOrderNumber,
  addTimelineEvent
} from '../controllers/invoiceTimelineController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All timeline routes require authentication
router.use(authenticate);

// Validation middleware for adding events
const eventValidation = [
  body('eventType').isIn([
    'bill_created',
    'discount_applied', 
    'inventory_updated',
    'payment_received',
    'email_sent',
    'pdf_generated',
    'status_changed',
    'customer_updated'
  ]).withMessage('Invalid event type'),
  body('description').notEmpty().withMessage('Event description is required'),
  body('details').optional().isObject().withMessage('Details must be an object')
];

// Routes
router.get('/order/:orderId', getInvoiceTimeline);
router.get('/invoice/:orderNumber', getTimelineByOrderNumber);
router.post('/order/:orderId/event', eventValidation, addTimelineEvent);

export default router;