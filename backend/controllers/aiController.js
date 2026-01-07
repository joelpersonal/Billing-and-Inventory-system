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
    const isConnected = await aiService.checkOllamaConnection();
    
    res.json({
      success: true,
      data: {
        ollama_connected: isConnected,
        model: process.env.OLLAMA_MODEL || 'llama3.2',
        url: process.env.OLLAMA_URL || 'http://localhost:11434'
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