/**
 * Test streaming endpoint
 * Run with: node tests/test-stream.mjs
 */

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function testStream() {
  console.log('Testing streaming endpoint...\n');

  const prompt = 'Write a short paragraph (about 100 words) explaining what streaming responses are and why they are useful for AI applications.';

  console.log(`Prompt: "${prompt}"\n`);
  console.log('--- Stream output (tokens arrive in real-time) ---\n');

  const startTime = Date.now();
  let firstChunkTime = null;
  let chunkCount = 0;

  const response = await fetch(`${BASE_URL}/api/ai-sdk/ask-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    console.error('Error:', response.status, await response.text());
    process.exit(1);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.replace('data: ', '');
      if (data === '[DONE]') {
        continue;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) {
          if (firstChunkTime === null) {
            firstChunkTime = Date.now();
          }
          chunkCount++;
          process.stdout.write(parsed.text);
        }
      } catch {
        // Skip non-JSON
      }
    }
  }

  const endTime = Date.now();

  console.log('\n\n--- Stream Statistics ---');
  console.log(`Total chunks received: ${chunkCount}`);
  console.log(`Time to first chunk: ${firstChunkTime ? firstChunkTime - startTime : 'N/A'}ms`);
  console.log(`Total time: ${endTime - startTime}ms`);
  console.log('--- Stream complete ---\n');
}

testStream().catch(console.error);
