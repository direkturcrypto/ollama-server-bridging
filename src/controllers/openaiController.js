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
    
    const response = await makeChatRequest(model, messages, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // Just return the vikey response as is since it should already be in OpenAI format
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error in chat completions endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request to vikey.ai', 
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
    
    const response = await makeCompletionRequest(model, prompt, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // Just return the vikey response as is since it should already be in OpenAI format
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error in completions endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request to vikey.ai', 
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
 * Handler for POST /v1/embeddings endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embeddings(req, res) {
  try {
    const { model, input, ...otherParams } = req.body;
    
    const response = await makeEmbeddingsRequest(model, input, otherParams);
    
    // Just return the vikey response as is since it should already be in OpenAI format
    res.json(response.data);
  } catch (error) {
    console.error('Error in embeddings endpoint:', error.message);
    res.status(500).json({ 
      error: { 
        message: 'Failed to proxy request to vikey.ai', 
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
  embeddings
}; 