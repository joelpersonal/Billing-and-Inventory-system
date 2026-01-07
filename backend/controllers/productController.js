import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      categories,
      stockStatus,
      minPrice,
      maxPrice,
      minStock,
      maxStock
    } = req.query;
    
    const query = {};
    const andConditions = [];
    
    // Category filter (single or multiple)
    if (category) {
      query.category = category;
    } else if (categories) {
      const categoryArray = categories.split(',');
      query.category = { $in: categoryArray };
    }
    
    // Search filter
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      });
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Stock quantity range filter
    if (minStock || maxStock) {
      query.quantity = {};
      if (minStock) query.quantity.$gte = parseInt(minStock);
      if (maxStock) query.quantity.$lte = parseInt(maxStock);
    }
    
    // Stock status filter
    if (stockStatus) {
      const statusArray = stockStatus.split(',');
      const stockConditions = [];
      
      if (statusArray.includes('out-of-stock')) {
        stockConditions.push({ quantity: 0 });
      }
      if (statusArray.includes('low-stock')) {
        stockConditions.push({ quantity: { $gt: 0, $lt: 10 } });
      }
      if (statusArray.includes('in-stock')) {
        stockConditions.push({ quantity: { $gte: 10 } });
      }
      
      if (stockConditions.length > 0) {
        andConditions.push({ $or: stockConditions });
      }
    }
    
    // Combine all conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};