const { getModelList, transformChatResponse, transformGenerateResponse } = require('../utils/modelUtils');
const { makeChatRequest, makeCompletionRequest, makeEmbeddingsRequest } = require('../utils/apiUtils');

/**
 * Handler for GET /api/tags endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getModels(req, res) {
  res.json(getModelList());
}

/**
 * Handler for POST /api/chat endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function chat(req, res) {
  try {
    const { model, messages, stream = true, ...otherParams } = req.body;
    
    const response = await makeChatRequest(model, messages, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // For non-streaming, transform the response to match Ollama format
      const vikeyResponse = response.data;
      res.json(transformChatResponse(model, messages, vikeyResponse));
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error.message);
    res.status(500).json({ error: 'Failed to proxy request', details: error.message });
  }
}

/**
 * Handler for POST /api/generate endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generate(req, res) {
  try {
    const { model, prompt, stream = true, ...otherParams } = req.body;
    
    const response = await makeCompletionRequest(model, prompt, stream, otherParams);
    
    if (stream) {
      // For streaming response, pipe the response stream directly
      response.data.pipe(res);
    } else {
      // For non-streaming, transform the response to match Ollama format
      const vikeyResponse = response.data;
      res.json(transformGenerateResponse(model, prompt, vikeyResponse));
    }
  } catch (error) {
    console.error('Error in generate endpoint:', error.message);
    res.status(500).json({ error: 'Failed to proxy request', details: error.message });
  }
}

/**
 * Handler for POST /api/embeddings endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embeddings(req, res) {
  try {
    const { model, prompt, ...otherParams } = req.body;
    
    const response = await makeEmbeddingsRequest(model, prompt, otherParams);
    
    // Transform the intelligence.io response to Ollama format
    const intelligenceResponse = response.data;
    res.json({
      embedding: intelligenceResponse.data[0].embedding
    });
  } catch (error) {
    console.error('Error in embeddings endpoint:', error.message);
    res.status(500).json({ error: 'Failed to proxy request to intelligence.io', details: error.message });
  }
}

/**
 * Handler for POST /api/embed endpoint (new endpoint alias for embeddings)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embed(req, res) {
  try {
    const { model, prompt, input, ...otherParams } = req.body;
    
    // Use prompt for Ollama API and input for OpenAI API compatibility
    const textToEmbed = input || prompt;
    
    const response = await makeEmbeddingsRequest(model, textToEmbed, otherParams);
    
    // Transform the intelligence.io response to Ollama format
    const intelligenceResponse = response.data;
    res.json({
      embedding: intelligenceResponse.data[0].embedding
    });
  } catch (error) {
    console.error('Error in embed endpoint:', error.message);
    res.status(500).json({ error: 'Failed to proxy request to intelligence.io', details: error.message });
  }
}

module.exports = {
  getModels,
  chat,
  generate,
  embeddings,
  embed
}; 