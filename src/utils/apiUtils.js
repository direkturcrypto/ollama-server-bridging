const axios = require('axios');
const { VIKEY_API_URL, INTELLIGENCE_API_URL, INTELLIGENCE_API_KEY, EMBEDDING_MODEL_MAP } = require('../config/config');

/**
 * Makes a chat completion request to vikey.ai
 * @param {string} model - Model name
 * @param {Array} messages - Chat messages
 * @param {boolean} stream - Whether to stream the response
 * @param {Object} otherParams - Additional parameters
 * @returns {Promise<Object>} - API response
 */
async function makeChatRequest(model, messages, stream = true, otherParams = {}) {
  return await axios.post(`${VIKEY_API_URL}/chat`, {
    model,
    messages,
    stream,
    ...otherParams
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: stream ? 'stream' : 'json'
  });
}

/**
 * Makes a completion request to vikey.ai
 * @param {string} model - Model name
 * @param {string} prompt - Text prompt
 * @param {boolean} stream - Whether to stream the response
 * @param {Object} otherParams - Additional parameters
 * @returns {Promise<Object>} - API response
 */
async function makeCompletionRequest(model, prompt, stream = true, otherParams = {}) {
  return await axios.post(`${VIKEY_API_URL}/completions`, {
    model,
    prompt,
    stream,
    ...otherParams
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: stream ? 'stream' : 'json'
  });
}

/**
 * Makes an embeddings request to intelligence.io.solutions
 * @param {string} model - Model name
 * @param {string|Array} input - Input for embedding
 * @param {Object} otherParams - Additional parameters
 * @returns {Promise<Object>} - API response
 */
async function makeEmbeddingsRequest(model, input, otherParams = {}) {
  // Map the model name to the corresponding intelligence.io model
  const mappedModel = EMBEDDING_MODEL_MAP[model] || EMBEDDING_MODEL_MAP['all-minilm'];
  
  return await axios.post(`${INTELLIGENCE_API_URL}/embeddings`, {
    model: mappedModel,
    input,
    encoding_format: "float",
    ...otherParams
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INTELLIGENCE_API_KEY}`
    }
  });
}

module.exports = {
  makeChatRequest,
  makeCompletionRequest,
  makeEmbeddingsRequest
}; 