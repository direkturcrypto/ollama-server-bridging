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
    // Special handling for curl requests without Content-Type header
    let body = req.body;
    
    // If the request body is a string (e.g., from curl -d), try to parse it
    if (typeof body === 'string' || body instanceof String) {
      try {
        body = JSON.parse(body);
        console.log('Parsed string body into JSON:', body);
      } catch (parseError) {
        console.error('Failed to parse string body as JSON:', parseError.message);
      }
    }
    
    const { model, prompt, input, ...otherParams } = body || {};
    const textToEmbed = input || prompt;
    
    if (!model) {
      return res.status(400).json({ 
        error: 'Missing required parameter: "model"' 
      });
    }
    
    if (!textToEmbed) {
      return res.status(400).json({ 
        error: 'Missing required parameter: Either "prompt" or "input" must be provided' 
      });
    }
    
    const response = await makeEmbeddingsRequest(model, textToEmbed, otherParams);
    
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
    // Log the request for debugging
    console.log('Embed Request Body (raw):', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    // If the request body is a string (likely from curl -d without content-type), try to parse it
    let body = req.body;
    
    if (typeof body === 'string' || body instanceof String) {
      try {
        body = JSON.parse(body);
        console.log('Successfully parsed string body into JSON:', body);
      } catch (parseError) {
        console.error('Failed to parse body as JSON, will use as-is:', parseError.message);
        // For simple string bodies, create an object with default parameters
        if (!body.model && !body.input && !body.prompt) {
          body = { model: 'hellord/mxbai-embed-large-v1:f16', input: body };
          console.log('Created default body object:', body);
        }
      }
    }
    
    // Extract parameters from the parsed body
    const model = body.model;
    const prompt = body.prompt || body.input;
    const input = body.input || body.prompt;
    
    const textToEmbed = input || prompt;
    
    // Validate required parameters
    if (!model) {
      return res.status(400).json({ 
        error: 'Missing required parameter: "model". Please provide a model parameter in your request.' 
      });
    }
    
    if (!textToEmbed) {
      return res.status(400).json({ 
        error: 'Missing required parameter: Either "prompt" or "input" must be provided' 
      });
    }
    
    console.log('Using model:', model);
    console.log('Text to embed:', textToEmbed);
    
    // Remove model and input/prompt from otherParams
    const { model: _, prompt: __, input: ___, ...otherParams } = body;
    
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