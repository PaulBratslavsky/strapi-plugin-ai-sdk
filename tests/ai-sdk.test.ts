/**
 * Tests for AI SDK plugin endpoints
 *
 * Run with: npx ts-node tests/ai-sdk.test.ts
 *
 * Make sure:
 * 1. Strapi is running (yarn dev)
 * 2. The endpoints are enabled in Users & Permissions (Public role)
 */

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';

interface AskResponse {
  data: {
    text: string;
  };
}

interface ErrorResponse {
  error: {
    message: string;
  };
}

async function testAskEndpoint(): Promise<void> {
  console.log('\n--- Testing POST /api/ai-sdk/ask ---\n');

  // Test 1: Valid request
  console.log('Test 1: Valid request with prompt');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-sdk/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Say "Hello, this is a test!" and nothing else.',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ Failed:', response.status, error);
    } else {
      const data: AskResponse = await response.json();
      console.log('✅ Success:', data.data.text.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // Test 2: Valid request with system prompt
  console.log('\nTest 2: Valid request with system prompt');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-sdk/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'What are you?',
        system: 'You are a helpful pirate. Always respond like a pirate.',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('❌ Failed:', response.status, error);
    } else {
      const data: AskResponse = await response.json();
      console.log('✅ Success:', data.data.text.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // Test 3: Missing prompt (should fail)
  console.log('\nTest 3: Missing prompt (should return 400)');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-sdk/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (response.status === 400) {
      console.log('✅ Correctly returned 400 Bad Request');
    } else {
      console.log('❌ Expected 400, got:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

async function testAskStreamEndpoint(): Promise<void> {
  console.log('\n--- Testing POST /api/ai-sdk/ask-stream ---\n');

  // Test 1: Valid streaming request
  console.log('Test 1: Valid streaming request');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-sdk/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Count from 1 to 5, one number per line.',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ Failed:', response.status, error);
      return;
    }

    // Check headers
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/event-stream')) {
      console.log('✅ Correct Content-Type: text/event-stream');
    } else {
      console.log('⚠️ Unexpected Content-Type:', contentType);
    }

    // Read the stream
    const reader = response.body?.getReader();
    if (!reader) {
      console.log('❌ No reader available');
      return;
    }

    const decoder = new TextDecoder();
    let fullText = '';
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.replace('data: ', '');
        if (data === '[DONE]') {
          console.log('✅ Received [DONE] signal');
          continue;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            fullText += parsed.text;
            chunkCount++;
          }
        } catch {
          // Skip non-JSON lines
        }
      }
    }

    console.log(`✅ Received ${chunkCount} chunks`);
    console.log('✅ Full response:', fullText.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Error:', error);
  }

  // Test 2: Missing prompt (should fail)
  console.log('\nTest 2: Missing prompt (should return 400)');
  try {
    const response = await fetch(`${BASE_URL}/api/ai-sdk/ask-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (response.status === 400) {
      console.log('✅ Correctly returned 400 Bad Request');
    } else {
      console.log('❌ Expected 400, got:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

async function runTests(): Promise<void> {
  console.log('='.repeat(50));
  console.log('AI SDK Plugin Endpoint Tests');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('='.repeat(50));

  // Check if server is running
  try {
    const health = await fetch(`${BASE_URL}/_health`);
    if (!health.ok) {
      console.log('\n❌ Strapi server is not running or not healthy');
      console.log('Please start Strapi with: yarn dev');
      process.exit(1);
    }
    console.log('\n✅ Strapi server is running');
  } catch {
    console.log('\n❌ Cannot connect to Strapi server at', BASE_URL);
    console.log('Please start Strapi with: yarn dev');
    process.exit(1);
  }

  await testAskEndpoint();
  await testAskStreamEndpoint();

  console.log('\n' + '='.repeat(50));
  console.log('Tests completed');
  console.log('='.repeat(50) + '\n');
}

runTests();
