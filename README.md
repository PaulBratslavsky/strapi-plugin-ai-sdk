# AI SDK Plugin for Strapi

A Strapi plugin that integrates [Vercel AI SDK](https://ai-sdk.dev/) with [Anthropic's Claude](https://www.anthropic.com/) models for text generation and streaming responses.

## Features

- Text generation with Claude models
- Server-Sent Events (SSE) streaming support
- AI SDK UI message stream protocol (compatible with `useChat` hook)
- Configurable via Strapi plugin config
- Works with Strapi's Users & Permissions

## Installation

### 1. Enable the plugin

In `config/plugins.ts`:

```typescript
export default ({ env }) => ({
  'ai-sdk': {
    enabled: true,
    resolve: 'src/plugins/ai-sdk',
    config: {
      anthropicApiKey: env('ANTHROPIC_API_KEY'),
      chatModel: env('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514'),
    },
  },
});
```

### 2. Set environment variables

Add to your `.env` file:

```env
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-20250514  # optional
```

### 3. Build and start

```bash
yarn build
yarn dev
```

### 4. Enable permissions

In Strapi admin panel:

1. Go to **Settings → Users & Permissions → Roles**
2. Select **Public** (or your desired role)
3. Under **Ai-sdk**, enable `ask`, `askStream`, and `chat`
4. Save

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `anthropicApiKey` | string | required | Your Anthropic API key |
| `chatModel` | string | `claude-sonnet-4-20250514` | Claude model to use |
| `baseURL` | string | undefined | Custom API base URL (optional) |

### Available Models

- `claude-sonnet-4-20250514`
- `claude-opus-4-20250514`
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`
- `claude-3-haiku-20240307`

## API Endpoints

### POST `/api/ai-sdk/ask`

Generate a text response (non-streaming).

**Request:**

```json
{
  "prompt": "What is the capital of France?",
  "system": "You are a helpful geography assistant."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | yes | The user's question or prompt |
| `system` | string | no | System prompt to set context |

**Response:**

```json
{
  "data": {
    "text": "The capital of France is Paris."
  }
}
```

### POST `/api/ai-sdk/ask-stream`

Generate a streaming text response using Server-Sent Events (SSE).

**Request:** Same as `/ask`

**Response:** SSE stream

```
data: {"text":"The"}

data: {"text":" capital"}

data: {"text":" of"}

data: {"text":" France"}

data: {"text":" is"}

data: {"text":" Paris."}

data: [DONE]
```

### POST `/api/ai-sdk/chat`

Chat endpoint using AI SDK UI message stream protocol. Compatible with the `useChat` hook from `@ai-sdk/react`.

**Request:**

```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi there! How can I help you?" },
    { "role": "user", "content": "Tell me a joke" }
  ],
  "system": "You are a helpful assistant."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messages` | array | yes | Array of message objects with `role` and `content` |
| `system` | string | no | System prompt to set context |

**Response:** UI message stream (compatible with AI SDK UI hooks)

The response uses the `x-vercel-ai-ui-message-stream: v1` protocol.

## Usage Examples

### JavaScript/TypeScript

#### Non-streaming request

```typescript
const response = await fetch('http://localhost:1337/api/ai-sdk/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Explain quantum computing in simple terms',
    system: 'You are a science teacher explaining to a 10-year-old',
  }),
});

const { data } = await response.json();
console.log(data.text);
```

#### Streaming request

```typescript
const response = await fetch('http://localhost:1337/api/ai-sdk/ask-stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write a short story about a robot',
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

  for (const line of lines) {
    const data = line.replace('data: ', '');
    if (data === '[DONE]') continue;

    const { text } = JSON.parse(data);
    process.stdout.write(text); // or update UI
  }
}
```

### cURL

```bash
# Non-streaming
curl -X POST http://localhost:1337/api/ai-sdk/ask \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'

# Streaming (use -N to disable buffering)
curl -N -X POST http://localhost:1337/api/ai-sdk/ask-stream \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Count from 1 to 10"}'
```

### React Example (Manual Streaming)

```tsx
import { useState } from 'react';

function ChatComponent() {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askStream = async (prompt: string) => {
    setLoading(true);
    setResponse('');

    const res = await fetch('/api/ai-sdk/ask-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.replace('data: ', '');
        if (data === '[DONE]') continue;
        const { text } = JSON.parse(data);
        setResponse(prev => prev + text);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => askStream('Tell me a joke')}>
        {loading ? 'Thinking...' : 'Ask'}
      </button>
      <p>{response}</p>
    </div>
  );
}
```

### React Example (with useChat hook)

Using the `useChat` hook from `@ai-sdk/react` with the `/chat` endpoint:

```tsx
import { useChat } from '@ai-sdk/react';

function ChatWithHook() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: 'http://localhost:1337/api/ai-sdk/chat',
  });

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
```

Install the AI SDK React package:

```bash
npm install @ai-sdk/react
```

## Programmatic Usage

You can also use the AI SDK manager directly in your Strapi code:

```typescript
import { aiSDKManager } from 'path/to/plugins/ai-sdk/server/src/lib/init-ai-sdk';

// Simple text generation
const result = await aiSDKManager.generateText('Hello!', {
  system: 'Be friendly',
});
console.log(result.text);

// With full options
const result = await aiSDKManager.generate({
  prompt: 'Explain AI',
  temperature: 0.5,
  maxOutputTokens: 500,
});

// Streaming
const { textStream } = await aiSDKManager.stream({ prompt: 'Tell a story' });
for await (const chunk of textStream) {
  process.stdout.write(chunk);
}
```

## Project Structure

```
src/plugins/ai-sdk/
├── server/
│   └── src/
│       ├── index.ts           # Plugin entry point
│       ├── register.ts        # Initialize AI SDK on startup
│       ├── controllers/
│       │   └── controller.ts  # API endpoint handlers
│       ├── services/
│       │   └── service.ts     # Business logic
│       ├── routes/
│       │   └── content-api/
│       │       └── index.ts   # Route definitions
│       └── lib/
│           ├── init-ai-sdk.ts # AI SDK manager class
│           ├── types.ts       # TypeScript types & constants
│           └── utils.ts       # Controller helpers
└── admin/                     # Admin panel UI (optional)
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `prompt is required` | Missing prompt in request | Include `prompt` in request body |
| `AI SDK not initialized` | Missing API key | Check `ANTHROPIC_API_KEY` in `.env` |
| `403 Forbidden` | Permissions not enabled | Enable permissions in Strapi admin |

### Error Response Format

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "prompt is required and must be a string"
  }
}
```

## Testing

Run the included test scripts:

```bash
# Full API tests
yarn test:api

# Stream test with statistics
yarn test:stream
```

## License

MIT
