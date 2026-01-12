import mongoose from 'mongoose';

const reorderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'ordered', 'received', 'cancelled'],
    default: 'pending'
  },
  triggerReason: {
    type: String,
    enum: ['low_stock', 'manual', 'scheduled'],
    default: 'low_stock'
  },
  supplierInfo: {
    name: String,
    email: String,
    phone: String
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  cost: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
reorderSchema.index({ product: 1, status: 1 });
reorderSchema.index({ createdAt: -1 });

export default mongoose.model('Reorder', reorderSchema);