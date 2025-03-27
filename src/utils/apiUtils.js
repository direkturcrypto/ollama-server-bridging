const axios = require('axios');
const { VIKEY_API_URL } = require('../config/config');

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
  return await axios.post(`${VIKEY_API_URL}/chat/completions`, {
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
 * Makes an embeddings request to vikey.ai
 * @param {string} model - Model name
 * @param {string|Array} input - Input for embedding
 * @param {Object} otherParams - Additional parameters
 * @returns {Promise<Object>} - API response
 */
async function makeEmbeddingsRequest(model, input, otherParams = {}) {
  return await axios.post(`${VIKEY_API_URL}/embeddings`, {
    model,
    input,
    ...otherParams
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

module.exports = {
  makeChatRequest,
  makeCompletionRequest,
  makeEmbeddingsRequest
}; 