import { DashboardService } from '../services/dashboardService.js';

export const getTotalProducts = async (req, res) => {
  try {
    const data = await DashboardService.getTotalProducts();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching total products',
      error: error.message
    });
  }
};

export const getStockValue = async (req, res) => {
  try {
    const data = await DashboardService.getStockValue();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock value',
      error: error.message
    });
  }
};

export const getTodaysSales = async (req, res) => {
  try {
    const data = await DashboardService.getTodaysSales();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s sales',
      error: error.message
    });
  }
};

export const getLowStockAlerts = async (req, res) => {
  try {
    const data = await DashboardService.getLowStockAlerts();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock alerts',
      error: error.message
    });
  }
};

export const getSalesRevenue = async (req, res) => {
  try {
    const data = await DashboardService.getSalesRevenue();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales revenue data',
      error: error.message
    });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const data = await DashboardService.getProductCategories();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product categories',
      error: error.message
    });
  }
};