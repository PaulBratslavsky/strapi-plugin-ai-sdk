/**
 * Test chat endpoint with UI message stream protocol
 * Run with: node tests/test-chat.mjs
 */

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function testChat() {
  console.log('Testing chat endpoint with UI message stream...\n');

  const messages = [
    {
      id: 'msg-1',
      role: 'user',
      parts: [{ type: 'text', text: 'Tell me a short story about a robot (2-3 paragraphs).' }]
    }
  ];

  console.log('Messages:', JSON.stringify(messages, null, 2));
  console.log('\n--- Stream output ---\n');

  const startTime = Date.now();
  let firstChunkTime = null;

  const response = await fetch(`${BASE_URL}/api/ai-sdk/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    console.error('Error:', response.status, await response.text());
    process.exit(1);
  }

  // Check for UI message stream header
  const streamHeader = response.headers.get('x-vercel-ai-ui-message-stream');
  console.log(`Stream protocol: ${streamHeader || 'not set'}\n`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if (firstChunkTime === null) {
      firstChunkTime = Date.now();
    }

    const chunk = decoder.decode(value, { stream: true });

    // Parse the UI message stream format
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // SSE format: "data: {...}" or "data: [DONE]"
      if (!line.startsWith('data: ')) continue;

      const data = line.substring(6); // Remove "data: " prefix

      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);

        // Handle text-delta messages
        if (parsed.type === 'text-delta' && parsed.delta) {
          process.stdout.write(parsed.delta);
          fullText += parsed.delta;
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  const endTime = Date.now();

  console.log('\n\n--- Stream Statistics ---');
  console.log(`Time to first chunk: ${firstChunkTime ? firstChunkTime - startTime : 'N/A'}ms`);
  console.log(`Total time: ${endTime - startTime}ms`);
  console.log(`Response length: ${fullText.length} characters`);
  console.log('--- Stream complete ---\n');
}

// Test with conversation history
async function testChatConversation() {
  console.log('\n=== Testing with conversation history ===\n');

  const messages = [
    {
      id: 'msg-1',
      role: 'user',
      parts: [{ type: 'text', text: 'My name is Alice.' }]
    },
    {
      id: 'msg-2',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Nice to meet you, Alice! How can I help you today?' }]
    },
    {
      id: 'msg-3',
      role: 'user',
      parts: [{ type: 'text', text: 'What is my name?' }]
    }
  ];

  console.log('Messages:', JSON.stringify(messages, null, 2));
  console.log('\n--- Stream output ---\n');

  const response = await fetch(`${BASE_URL}/api/ai-sdk/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      system: 'You are a helpful assistant. Be concise.'
    }),
  });

  if (!response.ok) {
    console.error('Error:', response.status, await response.text());
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      if (!line.startsWith('data: ')) continue;

      const data = line.substring(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        if (parsed.type === 'text-delta' && parsed.delta) {
          process.stdout.write(parsed.delta);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  console.log('\n\n--- Complete ---\n');
}

async function run() {
  await testChat();
  await testChatConversation();
}

run().catch(console.error);
