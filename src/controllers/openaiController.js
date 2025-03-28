const { getOpenAIModelList, getOpenAIModel } = require('../utils/modelUtils');
const { makeChatRequest, makeCompletionRequest, makeEmbeddingsRequest } = require('../utils/apiUtils');

/**
 * Handler for POST /v1/chat/completions endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function chatCompletions(req, res) {
  try {
    const { model, messages, stream = false, ...otherParams } = req.body;
    
    const response = await makeChatRequest("llama-3.1-8b-instruct", messages, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // Just return the vikey response as is since it should already be in OpenAI format
      response.data.model = model;
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error in chat completions endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request', 
        type: 'server_error' 
      } 
    });
  }
}

/**
 * Handler for POST /v1/completions endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function completions(req, res) {
  try {
    const { model, prompt, stream = false, ...otherParams } = req.body;
    
    const response = await makeCompletionRequest("llama-3.1-8b-instruct", prompt, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // Just return the vikey response as is since it should already be in OpenAI format
      response.data.model = model;
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error in completions endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request', 
        type: 'server_error' 
      } 
    });
  }
}

/**
 * Handler for GET /v1/models endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function listModels(req, res) {
  res.json(getOpenAIModelList());
}

/**
 * Handler for GET /v1/models/:model endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getModel(req, res) {
  const { model } = req.params;
  const modelInfo = getOpenAIModel(model);
  
  if (modelInfo) {
    res.json(modelInfo);
  } else {
    res.status(404).json({ error: { message: 'Model not found', type: 'invalid_request_error' } });
  }
}

/**
 * Parse request body if it's a string (from curl requests)
 * @param {*} body - Request body
 * @returns {Object} - Parsed body
 */
function parseBodyIfString(body) {
  if (typeof body === 'string' || body instanceof String) {
    try {
      return JSON.parse(body);
    } catch (parseError) {
      console.error('Failed to parse string body as JSON:', parseError.message);
      return body;
    }
  }
  return body;
}

/**
 * Handler for POST /v1/embeddings endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embeddings(req, res) {
  try {
    // Log the request for debugging
    console.log('OpenAI Embeddings Request Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Parse body if it's a string
    const body = parseBodyIfString(req.body);
    
    // Extract parameters from the request
    // Handle both JSON and form-data formats
    const model = body.model;
    const input = body.input;
    
    // Validate required parameters
    if (!model) {
      return res.status(400).json({ 
        error: { 
          message: 'Missing required parameter: "model"',
          type: 'invalid_request_error'
        }
      });
    }
    
    if (!input) {
      return res.status(400).json({ 
        error: { 
          message: 'Missing required parameter: "input"',
          type: 'invalid_request_error'
        }
      });
    }
    
    console.log('Using model:', model);
    console.log('Input to embed:', input);
    
    // Remove model and input from otherParams
    const { model: _, input: __, ...otherParams } = body;
    
    const response = await makeEmbeddingsRequest(model, input, otherParams);
    
    // Return the response in OpenAI format
    // Intelligence.io responses are already compatible with OpenAI format
    res.json(response.data);
  } catch (error) {
    console.error('Error in embeddings endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request to intelligence.io', 
        type: 'server_error' 
      } 
    });
  }
}

/**
 * Handler for POST /v1/embed endpoint (if needed for compatibility)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embed(req, res) {
  try {
    // Log the request for debugging
    console.log('OpenAI Embed Request Body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    // Parse body if it's a string
    const body = parseBodyIfString(req.body);
    
    // Extract parameters from the request
    // Handle both JSON and form-data formats
    const model = body.model;
    const input = body.input;
    
    // Validate required parameters
    if (!model) {
      return res.status(400).json({ 
        error: { 
          message: 'Missing required parameter: "model"',
          type: 'invalid_request_error'
        }
      });
    }
    
    if (!input) {
      return res.status(400).json({ 
        error: { 
          message: 'Missing required parameter: "input"',
          type: 'invalid_request_error'
        }
      });
    }
    
    console.log('Using model:', model);
    console.log('Input to embed:', input);
    
    // Remove model and input from otherParams
    const { model: _, input: __, ...otherParams } = body;
    
    const response = await makeEmbeddingsRequest(model, input, otherParams);
    
    // Return the response in OpenAI format
    // Intelligence.io responses are already compatible with OpenAI format
    res.json(response.data);
  } catch (error) {
    console.error('Error in embed endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request to intelligence.io', 
        type: 'server_error' 
      } 
    });
  }
}

module.exports = {
  chatCompletions,
  completions,
  listModels,
  getModel,
  embeddings,
  embed
}; 