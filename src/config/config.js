// Configuration constants
const PORT = 3000;
const VIKEY_API_URL = 'https://api.vikey.ai/v1';
const INTELLIGENCE_API_URL = 'https://api.intelligence.io.solutions/api/v1';
const INTELLIGENCE_API_KEY = process.env.IOINTELLIGENCE_API_KEY || 'your_default_api_key_here';
const SUPPORTED_MODELS = [
  'deepseek-r1:1.5b',
  'deepseek-r1:7b',
  'deepseek-r1:8b',
  'deepseek-r1:14b',
  'qwen2.5:7b-instruct-fp16',
  'hellord/mxbai-embed-large-v1:f16'
];

// Map Ollama model names to Intelligence.io model names for embeddings
const EMBEDDING_MODEL_MAP = {
  'hellord/mxbai-embed-large-v1:f16': 'mixedbread-ai/mxbai-embed-large-v1',
  'all-minilm': 'mixedbread-ai/mxbai-embed-large-v1', // Default fallback for Ollama's minilm
};

module.exports = {
  PORT,
  VIKEY_API_URL,
  INTELLIGENCE_API_URL,
  INTELLIGENCE_API_KEY,
  SUPPORTED_MODELS,
  EMBEDDING_MODEL_MAP
}; 