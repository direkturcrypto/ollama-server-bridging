// Configuration constants
const PORT = 3000;
const VIKEY_API_URL = 'https://api.vikey.ai/v1';
const SUPPORTED_MODELS = [
  'deepseek-r1:1.5b',
  'deepseek-r1:7b',
  'deepseek-r1:8b',
  'deepseek-r1:14b',
  'qwen2.5:7b-instruct-fp16'
];

module.exports = {
  PORT,
  VIKEY_API_URL,
  SUPPORTED_MODELS
}; 