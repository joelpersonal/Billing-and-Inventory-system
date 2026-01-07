import express from 'express';
import { getSearchSuggestions, checkAIStatus } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

// AI endpoints
router.get('/search-suggestions', getSearchSuggestions);
router.get('/status', checkAIStatus);

export default router;