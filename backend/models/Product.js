import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  // Auto Reorder Fields
  autoReorderEnabled: {
    type: Boolean,
    default: false
  },
  reorderPoint: {
    type: Number,
    default: 5 // Trigger reorder when stock reaches this level
  },
  reorderQuantity: {
    type: Number,
    default: 20 // How many units to reorder
  },
  supplierInfo: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  lastReorderDate: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ category: 1 });
productSchema.index({ quantity: 1 });

export default mongoose.model('Product', productSchema);