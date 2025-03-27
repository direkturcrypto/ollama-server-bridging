const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PORT } = require('./config/config');

// Import controllers
const ollamaController = require('./controllers/ollamaController');
const openaiController = require('./controllers/openaiController');

// Create Express app
const app = express();

// CORS middleware
app.use(cors());

// Parse raw bodies for application/json
app.use(bodyParser.raw({ 
  type: 'application/json', 
  limit: '50mb'
}));

// Handle raw Buffer for application/json requests
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json' && Buffer.isBuffer(req.body)) {
    try {
      const jsonString = req.body.toString('utf8');
      console.log('Received JSON string:', jsonString);
      req.body = JSON.parse(jsonString);
      console.log('Parsed JSON object:', req.body);
    } catch (error) {
      console.error('Error parsing JSON from buffer:', error.message);
    }
  }
  next();
});

// Regular body parsers for other content types
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log('───────────────────────────────────────');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request Body (processed):', JSON.stringify(req.body, null, 2));
  next();
});

// Body parser error handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  next(err);
});

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