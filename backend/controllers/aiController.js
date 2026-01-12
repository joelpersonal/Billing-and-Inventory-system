import aiService from '../services/aiService.js';

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query, context = 'general' } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          suggestions: aiService.getDefaultSuggestions(),
          source: 'default'
        }
      });
    }

    const suggestions = await aiService.generateSearchSuggestions(query, context);

    res.json({
      success: true,
      data: {
        suggestions,
        source: 'ai',
        query: query.trim()
      }
    });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating search suggestions',
      error: error.message
    });
  }
};

export const checkAIStatus = async (req, res) => {
  try {
    const connectionStatus = await aiService.checkAIConnection();
    
    res.json({
      success: true,
      data: {
        connected: connectionStatus.connected,
        provider: connectionStatus.provider,
        message: connectionStatus.message,
        model: process.env.AI_MODEL || 'microsoft/DialoGPT-medium',
        service: 'Hugging Face (Free)',
        fallbackAvailable: true,
        huggingfaceConfigured: !!process.env.HUGGINGFACE_API_TOKEN && process.env.HUGGINGFACE_API_TOKEN !== 'your_huggingface_token_here'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking AI status',
      error: error.message
    });
  }
};