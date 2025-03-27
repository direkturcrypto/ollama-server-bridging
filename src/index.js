const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const { PORT } = require('./config/config');

// Import controllers
const ollamaController = require('./controllers/ollamaController');
const openaiController = require('./controllers/openaiController');

// Create Express app
const app = express();

// CORS middleware
app.use(formData.parse());
app.use(cors());

// Regular body parsers for other content types
app.use(bodyParser.text());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


// Ollama API routes
app.get('/api/tags', ollamaController.getModels);
app.post('/api/chat', ollamaController.chat);
app.post('/api/generate', ollamaController.generate);
app.post('/api/embeddings', ollamaController.embeddings);
app.post('/api/embed', ollamaController.embed);

// OpenAI compatibility routes
app.post('/v1/chat/completions', openaiController.chatCompletions);
app.post('/v1/completions', openaiController.completions);
app.get('/v1/models', openaiController.listModels);
app.get('/v1/models/:model', openaiController.getModel);
app.post('/v1/embeddings', openaiController.embeddings);
app.post('/v1/embed', openaiController.embed);

// Version endpoint
app.get('/api/version', (req, res) => {
  res.json({ version: '0.1.0' });
});

// Fallback for unhandled routes
app.use((req, res) => {
  console.log('Endpoint not supported', req.url);
  res.status(404).json({ error: 'Endpoint not supported' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Ollama proxy server running on http://localhost:${PORT}`);
}); 