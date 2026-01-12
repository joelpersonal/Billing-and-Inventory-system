import InvoiceTimeline from '../models/InvoiceTimeline.js';

export class InvoiceTimelineService {
  
  /**
   * Create a new invoice timeline when order is created
   */
  static async createTimeline(orderId, orderNumber, userId) {
    try {
      const timeline = new InvoiceTimeline({
        orderId,
        orderNumber,
        events: [{
          eventType: 'bill_created',
          description: 'Invoice created',
          details: {
            orderNumber,
            createdBy: userId
          },
          userId,
          timestamp: new Date()
        }]
      });

      await timeline.save();
      return timeline;
    } catch (error) {
      console.error('Error creating invoice timeline:', error);
      throw error;
    }
  }

  /**
   * Add an event to existing timeline
   */
  static async addEvent(orderId, eventType, description, details = {}, userId = null) {
    try {
      const timeline = await InvoiceTimeline.findOne({ orderId });
      
      if (!timeline) {
        console.error('Timeline not found for order:', orderId);
        return null;
      }

      const newEvent = {
        eventType,
        description,
        details,
        userId,
        timestamp: new Date()
      };

      timeline.events.push(newEvent);
      await timeline.save();

      return newEvent;
    } catch (error) {
      console.error('Error adding timeline event:', error);
      throw error;
    }
  }

  /**
   * Get timeline for an order
   */
  static async getTimeline(orderId) {
    try {
      const timeline = await InvoiceTimeline.findOne({ orderId })
        .populate('events.userId', 'name email')
        .lean();

      if (!timeline) {
        return null;
      }

      // Sort events by timestamp (newest first for display)
      timeline.events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return timeline;
    } catch (error) {
      console.error('Error fetching timeline:', error);
      throw error;
    }
  }

  /**
   * Get timeline by order number
   */
  static async getTimelineByOrderNumber(orderNumber) {
    try {
      const timeline = await InvoiceTimeline.findOne({ orderNumber })
        .populate('events.userId', 'name email')
        .lean();

      if (!timeline) {
        return null;
      }

      // Sort events by timestamp (newest first for display)
      timeline.events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return timeline;
    } catch (error) {
      console.error('Error fetching timeline by order number:', error);
      throw error;
    }
  }

  /**
   * Helper methods for common events
   */
  static async addDiscountEvent(orderId, discountAmount, discountType, userId) {
    return this.addEvent(
      orderId,
      'discount_applied',
      `Discount applied (${discountType})`,
      { discountAmount, discountType },
      userId
    );
  }

  static async addInventoryUpdateEvent(orderId, productUpdates, userId) {
    return this.addEvent(
      orderId,
      'inventory_updated',
      'Inventory levels updated',
      { productUpdates },
      userId
    );
  }

  static async addPaymentEvent(orderId, paymentMethod, amount, userId) {
    return this.addEvent(
      orderId,
      'payment_received',
      `Payment received via ${paymentMethod}`,
      { paymentMethod, amount },
      userId
    );
  }

  static async addEmailEvent(orderId, recipientEmail, userId) {
    return this.addEvent(
      orderId,
      'email_sent',
      `Invoice emailed to ${recipientEmail}`,
      { recipientEmail },
      userId
    );
  }

  static async addPdfGeneratedEvent(orderId, userId) {
    return this.addEvent(
      orderId,
      'pdf_generated',
      'PDF invoice generated',
      {},
      userId
    );
  }

  static async addStatusChangeEvent(orderId, oldStatus, newStatus, userId) {
    return this.addEvent(
      orderId,
      'status_changed',
      `Status changed from ${oldStatus} to ${newStatus}`,
      { oldStatus, newStatus },
      userId
    );
  }

  /**
   * Get event type styling for frontend
   */
  static getEventStyling(eventType) {
    const styles = {
      'bill_created': { color: 'green', icon: '🟢', label: 'Created' },
      'discount_applied': { color: 'yellow', icon: '🟡', label: 'Discount' },
      'inventory_updated': { color: 'blue', icon: '🔵', label: 'Inventory' },
      'payment_received': { color: 'purple', icon: '🟣', label: 'Payment' },
      'email_sent': { color: 'indigo', icon: '📧', label: 'Email' },
      'pdf_generated': { color: 'gray', icon: '📄', label: 'PDF' },
      'status_changed': { color: 'orange', icon: '🔄', label: 'Status' },
      'customer_updated': { color: 'teal', icon: '👤', label: 'Customer' }
    };

    return styles[eventType] || { color: 'gray', icon: '⚪', label: 'Event' };
  }
}