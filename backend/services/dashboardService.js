import Product from '../models/Product.js';
import Order from '../models/Order.js';

export class DashboardService {
  // Get total products with growth percentage
  static async getTotalProducts() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentTotal, lastMonthTotal] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      })
    ]);

    const growthPercentage = lastMonthTotal > 0 
      ? ((currentTotal - lastMonthTotal) / lastMonthTotal * 100)
      : 0;

    return {
      total: currentTotal,
      growthPercentage: Math.round(growthPercentage * 100) / 100
    };
  }

  // Get stock value with growth percentage
  static async getStockValue() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [currentProducts, lastMonthProducts] = await Promise.all([
      Product.find(),
      Product.find({ createdAt: { $lt: startOfMonth } })
    ]);

    const currentStockValue = currentProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);

    const lastMonthStockValue = lastMonthProducts.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);

    const growthPercentage = lastMonthStockValue > 0 
      ? ((currentStockValue - lastMonthStockValue) / lastMonthStockValue * 100)
      : 0;

    return {
      stockValue: Math.round(currentStockValue * 100) / 100,
      growthPercentage: Math.round(growthPercentage * 100) / 100
    };
  }

  // Get today's sales with growth percentage
  static async getTodaysSales() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);

    const [todayOrders, yesterdayOrders] = await Promise.all([
      Order.find({
        createdAt: { $gte: startOfToday },
        status: 'completed'
      }),
      Order.find({
        createdAt: { $gte: startOfYesterday, $lt: startOfToday },
        status: 'completed'
      })
    ]);

    const todaySales = todayOrders.reduce((total, order) => total + order.totalAmount, 0);
    const yesterdaySales = yesterdayOrders.reduce((total, order) => total + order.totalAmount, 0);

    const growthPercentage = yesterdaySales > 0 
      ? ((todaySales - yesterdaySales) / yesterdaySales * 100)
      : 0;

    return {
      todaySales: Math.round(todaySales * 100) / 100,
      growthPercentage: Math.round(growthPercentage * 100) / 100
    };
  }

  // Get low stock alerts
  static async getLowStockAlerts() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [currentLowStock, lastWeekLowStock] = await Promise.all([
      Product.countDocuments({ quantity: { $lt: 10 } }),
      Product.countDocuments({
        quantity: { $lt: 10 },
        createdAt: { $lte: oneWeekAgo }
      })
    ]);

    return {
      lowStockCount: currentLowStock,
      differenceFromLastWeek: currentLowStock - lastWeekLowStock
    };
  }

  // Get sales and revenue data for the last 7 days
  static async getSalesRevenue() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      status: 'completed'
    }).sort({ createdAt: 1 });

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sales = new Array(7).fill(0);
    const revenue = new Array(7).fill(0);

    orders.forEach(order => {
      const dayIndex = order.createdAt.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to be last
      
      sales[adjustedIndex] += order.products.reduce((sum, item) => sum + item.quantity, 0);
      revenue[adjustedIndex] += order.totalAmount;
    });

    return {
      labels,
      sales,
      revenue: revenue.map(val => Math.round(val * 100) / 100)
    };
  }

  // Get product categories distribution
  static async getProductCategories() {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stockValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          stockValue: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return { categories };
  }

  // Get all dashboard data at once for PDF generation
  static async getDashboardData() {
    const [
      totalProducts,
      stockValue,
      todaysSales,
      lowStock,
      salesRevenue,
      productCategories
    ] = await Promise.all([
      this.getTotalProducts(),
      this.getStockValue(),
      this.getTodaysSales(),
      this.getLowStockAlerts(),
      this.getSalesRevenue(),
      this.getProductCategories()
    ]);

    return {
      totalProducts,
      stockValue,
      todaysSales,
      lowStock,
      salesRevenue,
      productCategories
    };
  }
}