import { AutoReorderService } from '../services/autoReorderService.js';

export const getAllReorders = async (req, res) => {
  try {
    const result = await AutoReorderService.getReorders(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reorders',
      error: error.message
    });
  }
};

export const getReorderStats = async (req, res) => {
  try {
    const result = await AutoReorderService.getReorderStats();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reorder statistics',
      error: error.message
    });
  }
};

export const updateReorderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...updates } = req.body;
    
    const result = await AutoReorderService.updateReorderStatus(id, status, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating reorder status',
      error: error.message
    });
  }
};

export const createManualReorder = async (req, res) => {
  try {
    const { productId, quantity, notes } = req.body;
    
    const result = await AutoReorderService.createManualReorder(
      productId, 
      quantity, 
      req.user._id, 
      notes
    );
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating manual reorder',
      error: error.message
    });
  }
};

export const checkAutoReorderTriggers = async (req, res) => {
  try {
    const result = await AutoReorderService.checkAutoReorderTriggers(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking auto reorder triggers',
      error: error.message
    });
  }
};