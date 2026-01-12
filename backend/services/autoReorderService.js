import Product from '../models/Product.js';
import Reorder from '../models/Reorder.js';
import { EmailService } from './emailService.js';

export class AutoReorderService {
  
  /**
   * Check all products for auto reorder triggers
   * This should be called after each sale/inventory update
   */
  static async checkAutoReorderTriggers(userId) {
    try {
      console.log('🔄 Checking auto reorder triggers...');
      
      // Find all products that need reordering
      const productsNeedingReorder = await Product.find({
        autoReorderEnabled: true,
        $expr: { $lte: ['$quantity', '$reorderPoint'] }
      });

      const reordersCreated = [];

      for (const product of productsNeedingReorder) {
        // Check if there's already a pending reorder for this product
        const existingReorder = await Reorder.findOne({
          product: product._id,
          status: { $in: ['pending', 'ordered'] }
        });

        if (!existingReorder) {
          // Create new reorder
          const reorder = await this.createReorder(product, userId);
          reordersCreated.push(reorder);
          
          console.log(`📦 Auto reorder created for ${product.name} (${product.quantity} left, reorder point: ${product.reorderPoint})`);
        }
      }

      return {
        success: true,
        reordersCreated: reordersCreated.length,
        reorders: reordersCreated
      };
    } catch (error) {
      console.error('❌ Error checking auto reorder triggers:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a new reorder for a product
   */
  static async createReorder(product, userId) {
    try {
      const reorder = await Reorder.create({
        product: product._id,
        quantity: product.reorderQuantity,
        triggerReason: 'low_stock',
        supplierInfo: product.supplierInfo,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: userId
      });

      // Update product's last reorder date
      await Product.findByIdAndUpdate(product._id, {
        lastReorderDate: new Date()
      });

      // Send notification email if supplier email exists
      if (product.supplierInfo?.email) {
        await this.sendReorderNotification(product, reorder);
      }

      return await Reorder.findById(reorder._id).populate('product', 'name sku');
    } catch (error) {
      console.error('Error creating reorder:', error);
      throw error;
    }
  }

  /**
   * Send reorder notification email to supplier
   */
  static async sendReorderNotification(product, reorder) {
    try {
      if (!product.supplierInfo?.email) {
        console.log('No supplier email found for product:', product.name);
        return;
      }

      const emailContent = {
        to: product.supplierInfo.email,
        subject: `Reorder Request - ${product.name} (SKU: ${product.sku})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px;">Automatic Reorder Request</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Inventory Management System</p>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${product.supplierInfo.name || 'Supplier'},</h2>
              
              <p>We need to reorder the following product as it has reached the minimum stock level:</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #8B5CF6; margin-top: 0;">Product Details</h3>
                <p><strong>Product Name:</strong> ${product.name}</p>
                <p><strong>SKU:</strong> ${product.sku}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Current Stock:</strong> ${product.quantity} units</p>
                <p><strong>Reorder Quantity:</strong> ${reorder.quantity} units</p>
                <p><strong>Estimated Delivery:</strong> ${reorder.estimatedDelivery.toLocaleDateString()}</p>
              </div>
              
              <p>Please confirm this order and provide delivery details.</p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="mailto:${process.env.MAIL_USER}?subject=Reorder Confirmation - ${product.sku}" 
                   style="background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); 
                          color: white; padding: 12px 30px; text-decoration: none; 
                          border-radius: 8px; display: inline-block;">
                  Confirm Order
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                This is an automated reorder request generated by our inventory management system.
              </p>
            </div>
          </div>
        `
      };

      // Note: This would use the existing EmailService but we'll just log for now
      console.log('📧 Reorder notification email prepared for:', product.supplierInfo.email);
      console.log('Email content:', emailContent.subject);
      
      return true;
    } catch (error) {
      console.error('Error sending reorder notification:', error);
      return false;
    }
  }

  /**
   * Get all reorders with filtering options
   */
  static async getReorders(filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        productId,
        dateFrom,
        dateTo
      } = filters;

      const query = {};
      
      if (status) query.status = status;
      if (productId) query.product = productId;
      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
        if (dateTo) query.createdAt.$lte = new Date(dateTo);
      }

      const reorders = await Reorder.find(query)
        .populate('product', 'name sku category price')
        .populate('createdBy', 'name email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Reorder.countDocuments(query);

      return {
        success: true,
        data: {
          reorders,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalReorders: total,
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      console.error('Error fetching reorders:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update reorder status
   */
  static async updateReorderStatus(reorderId, status, updates = {}) {
    try {
      const reorder = await Reorder.findByIdAndUpdate(
        reorderId,
        { 
          status, 
          ...updates,
          ...(status === 'received' && { actualDelivery: new Date() })
        },
        { new: true }
      ).populate('product');

      // If reorder is received, update product quantity
      if (status === 'received' && reorder) {
        await Product.findByIdAndUpdate(reorder.product._id, {
          $inc: { quantity: reorder.quantity }
        });
        
        console.log(`📦 Reorder received: Added ${reorder.quantity} units to ${reorder.product.name}`);
      }

      return {
        success: true,
        data: { reorder }
      };
    } catch (error) {
      console.error('Error updating reorder status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get reorder statistics
   */
  static async getReorderStats() {
    try {
      const [
        totalReorders,
        pendingReorders,
        orderedReorders,
        receivedReorders,
        recentReorders
      ] = await Promise.all([
        Reorder.countDocuments(),
        Reorder.countDocuments({ status: 'pending' }),
        Reorder.countDocuments({ status: 'ordered' }),
        Reorder.countDocuments({ status: 'received' }),
        Reorder.find({ status: { $in: ['pending', 'ordered'] } })
          .populate('product', 'name sku')
          .limit(5)
          .sort({ createdAt: -1 })
      ]);

      return {
        success: true,
        data: {
          totalReorders,
          pendingReorders,
          orderedReorders,
          receivedReorders,
          recentReorders
        }
      };
    } catch (error) {
      console.error('Error fetching reorder stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Manual reorder creation
   */
  static async createManualReorder(productId, quantity, userId, notes = '') {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const reorder = await Reorder.create({
        product: productId,
        quantity,
        triggerReason: 'manual',
        supplierInfo: product.supplierInfo,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes,
        createdBy: userId
      });

      await Product.findByIdAndUpdate(productId, {
        lastReorderDate: new Date()
      });

      return {
        success: true,
        data: { reorder: await Reorder.findById(reorder._id).populate('product', 'name sku') }
      };
    } catch (error) {
      console.error('Error creating manual reorder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}