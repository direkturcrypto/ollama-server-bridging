# Ollama Server Proxy

A proxy server that translates Ollama API requests to vikey.ai API calls. This allows applications built for Ollama to use vikey.ai as the backend AI service.

## Features

- Provides Ollama-compatible API endpoints
- Forwards requests to vikey.ai
- Supports the following models:
  - deepseek-r1:1.5b
  - deepseek-r1:7b
  - deepseek-r1:8b
  - deepseek-r1:14b
  - qwen2.5:7b-instruct-fp16
- OpenAI compatibility layer (supports `/v1/...` endpoints)

## Supported Endpoints

### Ollama API
- `/api/tags` - List available models
- `/api/chat` - Chat completion
- `/api/generate` - Text completion
- `/api/embeddings` - Generate embeddings
- `/api/version` - Get version info

### OpenAI API (for compatibility)
- `/v1/chat/completions` - Chat completion
- `/v1/completions` - Text completion
- `/v1/models` - List models
- `/v1/models/:model` - Get model info
- `/v1/embeddings` - Generate embeddings

## Installation

```bash
git clone <repository-url>
cd ollama-server-fake
npm install
```

## Usage

### Running the server

```bash
# Start the server
npm start

# Start with auto-reload during development
npm run dev
```

The server will be available at http://localhost:3000.

### Example API calls

#### List models
```bash
curl http://localhost:3000/api/tags
```

#### Chat completion
```bash
curl http://localhost:3000/api/chat -d '{
  "model": "deepseek-r1:7b",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}'
```

## Environment Variables

By default, the server runs on port 3000. You can modify this in the config file at `src/config/config.js`.

## License

ISC 