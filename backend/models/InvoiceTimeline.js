import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'bill_created',
      'discount_applied', 
      'inventory_updated',
      'payment_received',
      'email_sent',
      'pdf_generated',
      'status_changed',
      'customer_updated'
    ]
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Flexible object for event-specific data
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const invoiceTimelineSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  events: [timelineEventSchema]
}, {
  timestamps: true
});

// Index for better query performance
invoiceTimelineSchema.index({ orderId: 1 });
invoiceTimelineSchema.index({ orderNumber: 1 });
invoiceTimelineSchema.index({ 'events.timestamp': -1 });

export default mongoose.model('InvoiceTimeline', invoiceTimelineSchema);