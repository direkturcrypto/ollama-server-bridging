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
  try {
    // Map the model name to the corresponding intelligence.io model
    console.log(`Original model name: "${model}"`);
    const mappedModel = EMBEDDING_MODEL_MAP[model] || EMBEDDING_MODEL_MAP['default'] || 'mixedbread-ai/mxbai-embed-large-v1';
    console.log(`Mapped model name: "${mappedModel}"`);
    
    // Ensure input is properly formatted
    const formattedInput = Array.isArray(input) ? input : (typeof input === 'string' ? input : String(input));
    console.log('Formatted input:', formattedInput);
    
    // Build request payload
    const payload = {
      model: mappedModel,
      input: formattedInput,
      encoding_format: "float",
      ...otherParams
    };
    console.log('Payload for embedding request:', JSON.stringify(payload, null, 2));
    
    // Make the request
    const response = await axios.post(`${INTELLIGENCE_API_URL}/embeddings`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTELLIGENCE_API_KEY}`
      }
    });
    
    return response;
  } catch (error) {
    // Improved error logging
    console.error('Error in makeEmbeddingsRequest:');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.message);
    console.error('- Response data:', error.response?.data);
    console.error('- Original model:', model);
    console.error('- Input type:', typeof input);
    throw error;
  }
}

module.exports = {
  makeChatRequest,
  makeCompletionRequest,
  makeEmbeddingsRequest
}; 