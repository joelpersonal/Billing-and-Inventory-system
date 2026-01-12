import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { InvoiceInsightsService } from '../services/invoiceInsightsService.js';
import { AutoReorderService } from '../services/autoReorderService.js';
import { InvoiceTimelineService } from '../services/invoiceTimelineService.js';

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('products.product', 'name sku')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product', 'name sku category')
      .populate('createdBy', 'name email');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { products, customerName, customerEmail } = req.body;

    // Validate products and calculate totals
    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    const order = await Order.create({
      orderNumber,
      products: orderItems,
      totalAmount,
      customerName,
      customerEmail,
      createdBy: req.user._id
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('products.product', 'name sku')
      .populate('createdBy', 'name email');

    // Create invoice timeline
    try {
      await InvoiceTimelineService.createTimeline(order._id, orderNumber, req.user._id);
      
      // Add inventory update event
      const productUpdates = orderItems.map(item => ({
        productId: item.product,
        quantityReduced: item.quantity
      }));
      await InvoiceTimelineService.addInventoryUpdateEvent(order._id, productUpdates, req.user._id);
    } catch (timelineError) {
      console.error('Timeline creation failed:', timelineError);
      // Don't fail order creation if timeline fails
    }

    // Trigger auto reorder check after successful order creation
    try {
      const reorderResult = await AutoReorderService.checkAutoReorderTriggers(req.user._id);
      if (reorderResult.success && reorderResult.reordersCreated > 0) {
        console.log(`🔄 Auto reorder triggered: ${reorderResult.reordersCreated} reorders created`);
      }
    } catch (reorderError) {
      console.error('Auto reorder check failed:', reorderError);
      // Don't fail the order creation if reorder check fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = existingOrder.status;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('products.product', 'name sku');

    // Add timeline event for status change
    try {
      await InvoiceTimelineService.addStatusChangeEvent(
        order._id, 
        oldStatus, 
        status, 
        req.user._id
      );
    } catch (timelineError) {
      console.error('Timeline status update failed:', timelineError);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

export const getInvoiceInsights = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cartItems } = req.body; // Cart items with product details for profit calculation

    // Get the order
    const order = await Order.findById(orderId)
      .populate('products.product', 'name sku price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate insights
    const insights = await InvoiceInsightsService.generateInvoiceInsights(order, cartItems);

    res.json({
      success: true,
      data: { insights }
    });
  } catch (error) {
    console.error('Error generating invoice insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice insights',
      error: error.message
    });
  }
};