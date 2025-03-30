// Configuration constants
const PORT = process.env.NODE_PORT || 3000;
const VIKEY_API_URL = process.env.INFERENCE_API_URL || 'https://api.vikey.ai/v1';
const VIKEY_API_KEY = process.env.INFERENCE_API_KEY || 'your_default_api_key_here';
const GAIA_API_URL = process.env.EMBEDDING_API_URL || 'https://qwen7b.gaia.domains/v1';
const GAIA_API_KEY = process.env.EMBEDDING_API_KEY || 'your_default_api_key_here';
const SUPPORTED_MODELS = [
  'deepseek-r1:1.5b',
  'deepseek-r1:7b',
  'deepseek-r1:8b',
  'deepseek-r1:14b',
  'qwen2.5:7b-instruct-fp16',
  'llama3.1:8b-instruct-q4_K_M',
  'llama3.3:70b-instruct-fp16',
  'llama3.3:70b-instruct-q8_0',
  'hellord/mxbai-embed-large-v1:f16',
  'all-minilm' // Add all-minilm explicitly to supported models
];

// Map Ollama model names to Intelligence.io model names for embeddings
const EMBEDDING_MODEL_MAP = {
  'hellord/mxbai-embed-large-v1:f16': 'mixedbread-ai/mxbai-embed-large-v1',
  'all-minilm': 'nomic-embed', // Default fallback for Ollama's minilm
  'all-mini': 'nomic-embed', // Handle truncated name
  'default': 'nomic-embed' // Default fallback
};

module.exports = {
  PORT,
  VIKEY_API_URL,
  VIKEY_API_KEY,
  GAIA_API_URL,
  GAIA_API_KEY,
  SUPPORTED_MODELS,
  EMBEDDING_MODEL_MAP
}; 