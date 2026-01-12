# 🤖 Claude AI Integration Setup Guide

## Overview
Billfinity now uses Claude AI (by Anthropic) for intelligent search suggestions and AI-powered features. Claude provides more reliable, cloud-based AI capabilities compared to local LLM solutions.

## Prerequisites
- Claude API key from Anthropic
- Backend server running
- Internet connection for API calls

## Setup Steps

### 1. Get Claude API Key

#### Sign up for Anthropic Claude:
1. Visit: https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to "API Keys" section
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-`)

### 2. Configure Environment Variables

#### Development (.env):
```bash
# Claude AI Configuration
CLAUDE_API_KEY=sk-ant-your-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
```

#### Production (.env.production):
```bash
# Claude AI Configuration
CLAUDE_API_KEY=sk-ant-your-production-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
```

### 3. Available Claude Models

Choose the model that fits your needs:

#### Claude 3 Haiku (Recommended for search suggestions):
- **Model**: `claude-3-haiku-20240307`
- **Speed**: Fastest
- **Cost**: Lowest
- **Best for**: Quick responses, search suggestions

#### Claude 3 Sonnet (Balanced):
- **Model**: `claude-3-sonnet-20240229`
- **Speed**: Medium
- **Cost**: Medium
- **Best for**: Complex analysis, detailed insights

#### Claude 3 Opus (Most Capable):
- **Model**: `claude-3-opus-20240229`
- **Speed**: Slower
- **Cost**: Highest
- **Best for**: Complex reasoning, detailed analysis

### 4. Verify Installation

#### Check API Status:
```bash
# Start your backend server
npm start

# Check AI status endpoint
curl http://localhost:5000/api/ai/status
```

#### Expected Response:
```json
{
  "success": true,
  "data": {
    "claude_connected": true,
    "model": "claude-3-haiku-20240307",
    "provider": "Claude (Anthropic)"
  }
}
```

### 5. Test AI Features

#### In the Frontend:
1. **Search Suggestions**: Type in any search box to see Claude-powered suggestions
2. **AI Status**: Look for "AI: Claude" indicator in search boxes
3. **Context-Aware**: Try searching in different sections (Inventory, Billing, Reports)

## Features

### 🔍 AI-Powered Search Suggestions
- **Context-Aware**: Different suggestions based on current page (Inventory, Billing, Reports, Settings)
- **Real-time**: Suggestions appear as you type
- **Intelligent**: Claude understands business context and provides relevant actions
- **Fallback**: Graceful fallback to predefined suggestions if Claude is unavailable

### 📊 Smart Invoice Insights
- **Business Intelligence**: AI-powered analysis of invoice data
- **Pattern Recognition**: Customer buying patterns and trends
- **Profit Analysis**: Automated profit margin calculations
- **Stock Alerts**: Intelligent inventory level warnings

### 🎯 Context-Specific Prompts
- **Inventory**: Product management, stock tracking, category organization
- **Billing**: Invoice generation, payment tracking, customer management
- **Reports**: Data analysis, business insights, performance metrics
- **Settings**: System configuration, user management, preferences

## API Usage & Costs

### Claude API Pricing (as of 2024):
- **Claude 3 Haiku**: $0.25 per million input tokens, $1.25 per million output tokens
- **Claude 3 Sonnet**: $3 per million input tokens, $15 per million output tokens
- **Claude 3 Opus**: $15 per million input tokens, $75 per million output tokens

### Estimated Usage:
- **Search Suggestions**: ~50-100 tokens per request
- **Daily Usage**: ~1,000-5,000 tokens for typical business use
- **Monthly Cost**: $0.10-$2.00 for Haiku model (very affordable)

## Troubleshooting

### Common Issues:

#### 1. "AI: Offline" Status
- **Check API Key**: Ensure `CLAUDE_API_KEY` is set correctly
- **Verify Account**: Check your Anthropic console for account status
- **Check Credits**: Ensure you have API credits available

#### 2. No AI Suggestions
- **Fallback Mode**: System automatically uses predefined suggestions
- **Check Network**: Ensure internet connection for API calls
- **Check Logs**: Look at backend console for error messages

#### 3. Slow Responses
- **Model Choice**: Switch to Claude 3 Haiku for faster responses
- **Network Latency**: Check internet connection speed
- **API Limits**: Verify you haven't hit rate limits

### Debug Commands:

#### Check Environment Variables:
```bash
# In backend directory
node -e "console.log('Claude API Key:', process.env.CLAUDE_API_KEY ? 'Set' : 'Not Set')"
```

#### Test API Connection:
```bash
# Test endpoint
curl -X GET http://localhost:5000/api/ai/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Best Practices

### API Key Security:
1. **Never commit API keys** to version control
2. **Use environment variables** for all configurations
3. **Rotate keys regularly** in production
4. **Monitor usage** in Anthropic console
5. **Set up billing alerts** to avoid unexpected charges

### Production Deployment:
1. **Use separate API keys** for development and production
2. **Set up monitoring** for API usage and costs
3. **Implement rate limiting** to prevent abuse
4. **Log API errors** for debugging

## Migration from Ollama

### What Changed:
- ✅ **No local installation** required (cloud-based)
- ✅ **Better reliability** (no local server dependencies)
- ✅ **Faster responses** (optimized API)
- ✅ **More accurate suggestions** (advanced language model)
- ✅ **Production ready** (works on any hosting platform)

### Benefits:
- **Easier Deployment**: No need to install Ollama on servers
- **Better Performance**: Cloud-optimized infrastructure
- **Cost Effective**: Pay only for what you use
- **Scalable**: Handles multiple concurrent requests
- **Reliable**: 99.9% uptime SLA from Anthropic

---

## 🎉 Result

**Your Billfinity application now uses Claude AI for intelligent search suggestions and business insights. The AI features work reliably in both development and production environments without requiring local AI model installations.**

**Test the functionality at: http://localhost:5173 → Use search boxes in any section**

**Status: ✅ CLAUDE AI INTEGRATION COMPLETE**