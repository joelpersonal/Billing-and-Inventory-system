import { InvoiceTimelineService } from '../services/invoiceTimelineService.js';
import Order from '../models/Order.js';

export const getInvoiceTimeline = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify order exists and user has access
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const timeline = await InvoiceTimelineService.getTimeline(orderId);
    
    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Timeline not found for this invoice'
      });
    }

    res.json({
      success: true,
      data: {
        timeline,
        order: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          status: order.status
        }
      }
    });
  } catch (error) {
    console.error('Error fetching invoice timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice timeline',
      error: error.message
    });
  }
};

export const getTimelineByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const timeline = await InvoiceTimelineService.getTimelineByOrderNumber(orderNumber);
    
    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Timeline not found for this invoice number'
      });
    }

    // Get order details
    const order = await Order.findOne({ orderNumber });

    res.json({
      success: true,
      data: {
        timeline,
        order: order ? {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          customerName: order.customerName,
          status: order.status
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching timeline by order number:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice timeline',
      error: error.message
    });
  }
};

export const addTimelineEvent = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { eventType, description, details } = req.body;
    const userId = req.user.id;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const event = await InvoiceTimelineService.addEvent(
      orderId,
      eventType,
      description,
      details,
      userId
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Timeline not found for this order'
      });
    }

    res.json({
      success: true,
      data: { event },
      message: 'Timeline event added successfully'
    });
  } catch (error) {
    console.error('Error adding timeline event:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding timeline event',
      error: error.message
    });
  }
};