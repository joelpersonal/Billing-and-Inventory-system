# 🤖 ~~Ollama AI Integration Setup Guide~~ - DEPRECATED

## ⚠️ NOTICE: This guide is deprecated

**Billfinity now uses Claude AI instead of Ollama for better reliability and performance.**

**Please see: [CLAUDE_AI_SETUP_GUIDE.md](./CLAUDE_AI_SETUP_GUIDE.md)**

---

## Why We Switched to Claude AI:

### Issues with Ollama:
- ❌ **Local Installation Required**: Complex setup on different systems
- ❌ **Resource Intensive**: High CPU/RAM usage
- ❌ **Deployment Challenges**: Difficult to deploy on cloud platforms
- ❌ **Reliability Issues**: Local server can crash or become unavailable
- ❌ **Model Management**: Need to download and manage large model files

### Benefits of Claude AI:
- ✅ **Cloud-Based**: No local installation required
- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **Fast**: Optimized API responses
- ✅ **Production Ready**: Works on any hosting platform
- ✅ **Cost Effective**: Pay only for usage (~$0.10-$2.00/month)
- ✅ **Better AI**: More accurate and context-aware responses

---

## Migration Steps:

If you were using Ollama, follow these steps to migrate to Claude:

1. **Get Claude API Key**: Sign up at https://console.anthropic.com/
2. **Update Environment Variables**: Replace Ollama config with Claude config
3. **Remove Ollama**: Uninstall Ollama from your system (optional)
4. **Test**: Verify AI features work with Claude

### Environment Variable Changes:

#### Old (Ollama):
```bash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

#### New (Claude):
```bash
CLAUDE_API_KEY=sk-ant-your-api-key-here
CLAUDE_MODEL=claude-3-haiku-20240307
```

---

## Legacy Documentation (For Reference Only):

*The rest of this document contains the original Ollama setup instructions for reference purposes only. Do not follow these instructions for new installations.*
# Test if Ollama is running
curl http://localhost:11434/api/tags

# Test model
ollama run llama3.2 "Hello, how are you?"
```

## Configuration

### Backend Configuration
The backend is already configured with these environment variables in `.env`:

```env
# Ollama AI Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Customization
You can change the model by updating the `OLLAMA_MODEL` variable:
- `llama3.2` (recommended)
- `llama3.1`
- `llama2`
- `codellama` (for code-related queries)

## Features

### AI-Powered Search Suggestions
- **Context-Aware**: Different suggestions based on the page (inventory, billing, reports, settings)
- **Real-Time**: Suggestions appear as you type
- **Fallback**: Works even when Ollama is offline with predefined suggestions
- **Visual Indicators**: Shows AI status and model information

### Page-Specific Contexts
- **Inventory Management**: Product management, stock tracking, inventory operations
- **Billing & Invoices**: Invoice generation, payment tracking, customer billing
- **Analytics & Reports**: Data analysis, report generation, business insights
- **System Settings**: System preferences, user management, configuration

### Search Box Features
- ✨ AI-powered suggestions with sparkle icon
- 🔍 Traditional search functionality
- 🤖 AI status indicator
- 📝 Suggestion categories (action, filter, view, tip)
- 🎯 Context-aware responses

## Usage

### How to Use AI Search
1. **Navigate** to any supported page (Inventory, Billing, Reports, Settings)
2. **Click** on the search box (you'll see a ✨ sparkle icon if AI is connected)
3. **Type** your query (e.g., "low stock items", "create invoice", "sales report")
4. **View** AI-generated suggestions in the dropdown
5. **Click** on any suggestion to select it

### Example Queries
- **Inventory**: "products running low", "add new item", "check categories"
- **Billing**: "create invoice", "pending payments", "customer reports"
- **Reports**: "sales analytics", "export data", "business performance"
- **Settings**: "user management", "system preferences", "notifications"

## Troubleshooting

### AI Not Working?
1. **Check Ollama Status**: Ensure Ollama is running on port 11434
2. **Verify Model**: Make sure the specified model is downloaded
3. **Check Logs**: Look at backend console for AI-related errors
4. **Fallback Mode**: System will work with predefined suggestions if AI is offline

### Common Issues
- **Port 11434 not accessible**: Restart Ollama service
- **Model not found**: Run `ollama pull llama3.2`
- **Slow responses**: Consider using a smaller model like `llama2`
- **Connection timeout**: Check firewall settings

### Performance Tips
- Use `llama3.2` for best balance of speed and quality
- Ensure sufficient RAM (8GB+ recommended)
- Close other resource-intensive applications

## API Endpoints

### AI Status Check
```
GET /api/ai/status
```

### Search Suggestions
```
GET /api/ai/search-suggestions?query=your_query&context=inventory
```

## System Requirements
- **RAM**: 8GB+ recommended
- **Storage**: 4GB+ for model files
- **CPU**: Modern multi-core processor
- **Network**: Internet connection for initial model download

---

**Status**: ✅ AI-powered search integration complete with Ollama support