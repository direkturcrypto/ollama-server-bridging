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
 * Parse raw request data when content-type is missing
 * @param {Object} req - Express request object
 * @returns {Object} - Parsed body
 */
function parseRequestBody(req) {
  console.log('Headers:', req.headers);
  console.log('Raw body:', req.body);
  
  let body = req.body;
  
  // If the body is a string (text/plain or no content-type), try to parse it as JSON
  if (typeof body === 'string' || body instanceof String) {
    try {
      body = JSON.parse(body);
      console.log('Successfully parsed string body as JSON:', body);
    } catch (parseError) {
      console.error('Failed to parse string body as JSON:', parseError.message);
    }
  }
  // If the body is a Buffer (raw data), try to parse it
  else if (Buffer.isBuffer(body)) {
    try {
      const jsonString = body.toString('utf8');
      console.log('Raw buffer data:', jsonString);
      body = JSON.parse(jsonString);
      console.log('Successfully parsed buffer data as JSON:', body);
    } catch (parseError) {
      console.error('Failed to parse buffer as JSON:', parseError.message);
    }
  }
  // If we have a raw body (no content-type), try to parse it
  else if (!req.headers['content-type'] && body) {
    try {
      // Try to parse as JSON if it's an object
      if (typeof body === 'object') {
        console.log('Using object body as-is:', body);
      }
      // Default case: if we have raw data but couldn't parse it
      else {
        console.log('Could not parse body, using as plain text');
      }
    } catch (error) {
      console.error('Error processing raw body:', error.message);
    }
  }
  
  return body || {};
}

/**
 * Handler for POST /api/embeddings endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function embeddings(req, res) {
  try {
    // Parse request body regardless of content-type
    const body = parseRequestBody(req);
    
    // Extract parameters with fallbacks
    const model = body.model || 'all-minilm';
    const prompt = body.prompt || body.input;
    const input = body.input || body.prompt;
    const textToEmbed = input || prompt || '';
    
    console.log('Extracted model:', model);
    console.log('Extracted text to embed:', textToEmbed);
    
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
    
    // Remove model and input/prompt from otherParams
    const { model: _, prompt: __, input: ___, ...otherParams } = body;
    
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
    // Log the request info for debugging
    console.log('Embed Request URL:', req.url);
    console.log('Embed Request Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('All Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Raw Body:', req.body);
    
    // Parse request body regardless of content-type
    const body = parseRequestBody(req);
    
    // Extract parameters with fallbacks
    const model = body.model || 'all-minilm';
    const prompt = body.prompt || body.input;
    const input = body.input || body.prompt;
    const textToEmbed = input || prompt || '';
    
    console.log('Parsed request body:', body);
    console.log('Using model:', model);
    console.log('Text to embed:', textToEmbed);
    
    // Validate required parameters (with more forgiving validation)
    if (!textToEmbed) {
      return res.status(400).json({ 
        error: 'Missing required parameter: Either "prompt" or "input" must be provided' 
      });
    }
    
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