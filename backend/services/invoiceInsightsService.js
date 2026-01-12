import Order from '../models/Order.js';
import Product from '../models/Product.js';

export class InvoiceInsightsService {
  
  /**
   * Generate smart insights for a newly created invoice
   * @param {Object} order - The order object
   * @param {Array} cartItems - The cart items with product details
   * @returns {Object} - Insights object with profit, customer patterns, and top items
   */
  static async generateInvoiceInsights(order, cartItems) {
    try {
      const insights = {
        profit: await this.calculateProfitInsight(cartItems),
        customerPattern: await this.getCustomerBuyingPattern(order.customerEmail),
        topSellingItem: await this.getTodaysTopSellingItem(),
        salesComparison: await this.getSalesComparison(order.totalAmount),
        stockAlert: await this.getStockAlerts(cartItems),
        revenueImpact: await this.getRevenueImpact(order.totalAmount)
      };

      return insights;
    } catch (error) {
      console.error('Error generating invoice insights:', error);
      return null;
    }
  }

  /**
   * Calculate profit from the current bill
   */
  static async calculateProfitInsight(cartItems) {
    try {
      let totalProfit = 0;
      let totalCost = 0;
      let totalRevenue = 0;

      for (const item of cartItems) {
        const product = await Product.findById(item._id);
        if (product) {
          // Assuming cost is 60% of selling price (you can adjust this or add cost field to Product model)
          // In a real scenario, you'd want to store actual cost in the Product model
          const itemCost = product.price * 0.6;
          const itemRevenue = product.price * item.quantity;
          const itemProfit = (product.price - itemCost) * item.quantity;
          
          totalCost += itemCost * item.quantity;
          totalRevenue += itemRevenue;
          totalProfit += itemProfit;
        }
      }

      const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

      return {
        amount: Math.round(totalProfit * 100) / 100,
        margin: Math.round(profitMargin * 100) / 100,
        message: `You made ₹${Math.round(totalProfit)} profit from this bill (${Math.round(profitMargin)}% margin)`
      };
    } catch (error) {
      console.error('Error calculating profit:', error);
      return {
        amount: 0,
        margin: 0,
        message: 'Profit calculation unavailable'
      };
    }
  }

  /**
   * Analyze customer buying patterns
   */
  static async getCustomerBuyingPattern(customerEmail) {
    try {
      if (!customerEmail) {
        return {
          frequency: 0,
          message: 'Customer buying pattern unavailable (no email provided)'
        };
      }

      // Get all orders from this customer
      const customerOrders = await Order.find({ 
        customerEmail: customerEmail,
        status: 'completed'
      }).sort({ createdAt: -1 });

      if (customerOrders.length < 2) {
        return {
          frequency: 0,
          message: 'New customer - first time purchase!'
        };
      }

      // Calculate average days between purchases
      let totalDaysBetween = 0;
      for (let i = 1; i < customerOrders.length; i++) {
        const daysDiff = Math.abs(
          (new Date(customerOrders[i-1].createdAt) - new Date(customerOrders[i].createdAt)) / (1000 * 60 * 60 * 24)
        );
        totalDaysBetween += daysDiff;
      }

      const avgDaysBetween = Math.round(totalDaysBetween / (customerOrders.length - 1));
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        frequency: avgDaysBetween,
        totalOrders: customerOrders.length,
        totalSpent: Math.round(totalSpent),
        message: `This customer buys every ${avgDaysBetween} days (${customerOrders.length} orders, ₹${Math.round(totalSpent)} total)`
      };
    } catch (error) {
      console.error('Error analyzing customer pattern:', error);
      return {
        frequency: 0,
        message: 'Customer pattern analysis unavailable'
      };
    }
  }

  /**
   * Get today's top selling item
   */
  static async getTodaysTopSellingItem() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get all orders from today
      const todaysOrders = await Order.find({
        createdAt: { $gte: today, $lt: tomorrow },
        status: 'completed'
      }).populate('products.product');

      if (todaysOrders.length === 0) {
        return {
          name: 'No sales today',
          quantity: 0,
          message: 'No top selling item today yet'
        };
      }

      // Count quantities by product
      const productSales = {};
      todaysOrders.forEach(order => {
        order.products.forEach(item => {
          const productName = item.product.name;
          if (productSales[productName]) {
            productSales[productName] += item.quantity;
          } else {
            productSales[productName] = item.quantity;
          }
        });
      });

      // Find top selling item
      let topItem = { name: '', quantity: 0 };
      for (const [name, quantity] of Object.entries(productSales)) {
        if (quantity > topItem.quantity) {
          topItem = { name, quantity };
        }
      }

      return {
        name: topItem.name,
        quantity: topItem.quantity,
        message: `Top selling item today: ${topItem.name} (${topItem.quantity} sold)`
      };
    } catch (error) {
      console.error('Error getting top selling item:', error);
      return {
        name: 'Analysis unavailable',
        quantity: 0,
        message: 'Top selling item analysis unavailable'
      };
    }
  }

  /**
   * Compare current sale with daily average
   */
  static async getSalesComparison(currentSaleAmount) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = await Order.find({
        createdAt: { $gte: thirtyDaysAgo },
        status: 'completed'
      });

      if (recentOrders.length === 0) {
        return {
          comparison: 'first',
          message: 'This is your first sale! 🎉'
        };
      }

      const avgSale = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0) / recentOrders.length;
      const percentageDiff = ((currentSaleAmount - avgSale) / avgSale * 100);

      if (percentageDiff > 20) {
        return {
          comparison: 'above',
          percentage: Math.round(percentageDiff),
          message: `This sale is ${Math.round(percentageDiff)}% above your 30-day average! 📈`
        };
      } else if (percentageDiff < -20) {
        return {
          comparison: 'below',
          percentage: Math.abs(Math.round(percentageDiff)),
          message: `This sale is ${Math.abs(Math.round(percentageDiff))}% below your 30-day average`
        };
      } else {
        return {
          comparison: 'average',
          message: 'This sale is close to your 30-day average'
        };
      }
    } catch (error) {
      console.error('Error comparing sales:', error);
      return {
        comparison: 'unavailable',
        message: 'Sales comparison unavailable'
      };
    }
  }

  /**
   * Check for stock alerts based on items sold
   */
  static async getStockAlerts(cartItems) {
    try {
      const lowStockItems = [];
      
      for (const item of cartItems) {
        const product = await Product.findById(item._id);
        if (product && product.quantity <= 5) {
          lowStockItems.push({
            name: product.name,
            remaining: product.quantity
          });
        }
      }

      if (lowStockItems.length === 0) {
        return {
          hasAlerts: false,
          message: 'All items have good stock levels'
        };
      }

      const itemNames = lowStockItems.map(item => `${item.name} (${item.remaining} left)`).join(', ');
      return {
        hasAlerts: true,
        items: lowStockItems,
        message: `⚠️ Low stock alert: ${itemNames}`
      };
    } catch (error) {
      console.error('Error checking stock alerts:', error);
      return {
        hasAlerts: false,
        message: 'Stock alert check unavailable'
      };
    }
  }

  /**
   * Calculate revenue impact
   */
  static async getRevenueImpact(currentSaleAmount) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todaysOrders = await Order.find({
        createdAt: { $gte: today, $lt: tomorrow },
        status: 'completed'
      });

      const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const percentageOfToday = todaysRevenue > 0 ? (currentSaleAmount / todaysRevenue * 100) : 100;

      return {
        todaysRevenue: Math.round(todaysRevenue),
        percentage: Math.round(percentageOfToday),
        message: `This sale contributes ${Math.round(percentageOfToday)}% to today's revenue (₹${Math.round(todaysRevenue)} total)`
      };
    } catch (error) {
      console.error('Error calculating revenue impact:', error);
      return {
        todaysRevenue: 0,
        percentage: 0,
        message: 'Revenue impact calculation unavailable'
      };
    }
  }
}