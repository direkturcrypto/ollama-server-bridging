const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/config');

// Import controllers
const ollamaController = require('./controllers/ollamaController');
const openaiController = require('./controllers/openaiController');

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Ollama API routes
app.get('/api/tags', ollamaController.getModels);
app.post('/api/chat', ollamaController.chat);
app.post('/api/generate', ollamaController.generate);
app.post('/api/embeddings', ollamaController.embeddings);

// OpenAI compatibility routes
app.post('/v1/chat/completions', openaiController.chatCompletions);
app.post('/v1/completions', openaiController.completions);
app.get('/v1/models', openaiController.listModels);
app.get('/v1/models/:model', openaiController.getModel);
app.post('/v1/embeddings', openaiController.embeddings);

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({ version: '0.1.0' });
});

// Fallback for unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not supported' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Ollama proxy server running on http://localhost:${PORT}`);
}); 