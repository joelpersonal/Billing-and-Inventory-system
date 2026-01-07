import express from 'express';
import {
  getTotalProducts,
  getStockValue,
  getTodaysSales,
  getLowStockAlerts,
  getSalesRevenue,
  getProductCategories
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// Dashboard endpoints
router.get('/total-products', getTotalProducts);
router.get('/stock-value', getStockValue);
router.get('/todays-sales', getTodaysSales);
router.get('/low-stock', getLowStockAlerts);
router.get('/sales-revenue', getSalesRevenue);
router.get('/product-categories', getProductCategories);

export default router;