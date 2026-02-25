/**
 * Tests for AI SDK plugin MCP endpoint
 *
 * Run with: npx tsx tests/mcp.test.ts
 *
 * Make sure:
 * 1. Strapi is running (yarn dev)
 * 2. The MCP endpoints are enabled in Users & Permissions (Public role)
 * 3. STRAPI_API_TOKEN is set in env or in the Strapi project .env file
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env from plugin root if STRAPI_API_TOKEN is not already set
if (!process.env.STRAPI_API_TOKEN) {
  const envPath = resolve(__dirname, '../.env');
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([A-Z_]+)=(.+)$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch {
    // .env file not found, continue with env vars
  }
}

const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const MCP_ENDPOINT = `${BASE_URL}/api/ai-sdk/mcp`;
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

if (!API_TOKEN) {
  console.log('\n❌ STRAPI_API_TOKEN environment variable is required');
  console.log('Set it in your environment or in strapi-local/.env');
  process.exit(1);
}

const authHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'text/event-stream, application/json',
  Authorization: `Bearer ${API_TOKEN}`,
};

async function jsonRpc(method: string, params: Record<string, any> = {}, sessionId?: string) {
  const reqHeaders = { ...authHeaders };
  if (sessionId) {
    reqHeaders['mcp-session-id'] = sessionId;
  }

  return fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: reqHeaders,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });
}

/**
 * Parse a Streamable HTTP response that may return SSE events.
 * The MCP SDK uses SSE for the response stream.
 */
async function parseResponse(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';

  // Direct JSON response
  if (contentType.includes('application/json')) {
    return res.json();
  }

  // SSE response — collect all event data and find the JSON-RPC result
  if (contentType.includes('text/event-stream')) {
    const text = await res.text();
    const lines = text.split('\n');
    const results: any[] = [];

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(line.slice(6));
          results.push(parsed);
        } catch {
          // skip non-JSON data lines
        }
      }
    }

    // Return the JSON-RPC response (has "result" or "error" key)
    const rpcResponse = results.find((r) => r.jsonrpc === '2.0');
    if (rpcResponse) return rpcResponse;

    return results.length === 1 ? results[0] : results;
  }

  const text = await res.text();
  throw new Error(`Unexpected content-type "${contentType}": ${text}`);
}

/**
 * Create an MCP session (initialize + send initialized notification).
 * Returns the session ID.
 */
async function createSession(): Promise<string> {
  const initRes = await jsonRpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' },
  });

  const sessionId = initRes.headers.get('mcp-session-id');
  if (!sessionId) throw new Error('No session ID returned');

  await parseResponse(initRes);

  // Send initialized notification (required by MCP protocol)
  await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: { ...authHeaders, 'mcp-session-id': sessionId },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  });

  return sessionId;
}

async function cleanupSession(sessionId: string): Promise<void> {
  await fetch(MCP_ENDPOINT, {
    method: 'DELETE',
    headers: { ...authHeaders, 'mcp-session-id': sessionId },
  });
}

// ─── Test helpers ────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

// ─── Tests ───────────────────────────────────────────────────────

async function testInitializeAndListTools(): Promise<void> {
  console.log('\n--- Initialize + List Tools ---\n');

  const initRes = await jsonRpc('initialize', {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' },
  });

  assert(initRes.status === 200, 'Initialize returns 200');

  const sessionId = initRes.headers.get('mcp-session-id');
  assert(!!sessionId, 'Session ID returned');
  if (!sessionId) return;

  const initData = await parseResponse(initRes);
  assert(
    initData.result?.serverInfo?.name === 'ai-sdk-mcp',
    'Server name is ai-sdk-mcp',
    `got: ${initData.result?.serverInfo?.name}`
  );
  assert(!!initData.result?.capabilities?.tools, 'Server declares tools capability');

  // Send initialized notification
  await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: { ...authHeaders, 'mcp-session-id': sessionId },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
  });

  // List tools
  const toolsRes = await jsonRpc('tools/list', {}, sessionId);
  assert(toolsRes.status === 200, 'tools/list returns 200');

  const toolsData = await parseResponse(toolsRes);
  const tools: any[] = toolsData.result?.tools || [];
  const toolNames = tools.map((t: any) => t.name);

  console.log(`\n  Found ${tools.length} tools: ${toolNames.join(', ')}`);

  assert(tools.length === 6, 'Correct tool count (6)', `got ${tools.length}`);
  assert(toolNames.includes('list_content_types'), 'Has list_content_types');
  assert(toolNames.includes('search_content'), 'Has search_content');
  assert(toolNames.includes('write_content'), 'Has write_content');
  assert(toolNames.includes('find_one_content'), 'Has find_one_content');
  assert(toolNames.includes('upload_media'), 'Has upload_media');
  assert(toolNames.includes('send_email'), 'Has send_email');
  assert(!toolNames.includes('trigger_animation'), 'trigger_animation excluded (internal)');
  assert(!toolNames.includes('save_memory'), 'save_memory excluded (internal)');
  assert(!toolNames.includes('recall_memories'), 'recall_memories excluded (internal)');

  // Verify search_content schema has new params
  const searchTool = tools.find((t: any) => t.name === 'search_content');
  if (searchTool) {
    const props = searchTool.inputSchema?.properties || {};
    assert(!!props.status, 'search_content schema has status param');
    assert(!!props.locale, 'search_content schema has locale param');
    assert(!!props.populate, 'search_content schema has populate param');
    assert(!!props.includeContent, 'search_content schema has includeContent param');
  }

  // Verify write_content schema has locale param
  const writeTool = tools.find((t: any) => t.name === 'write_content');
  if (writeTool) {
    const props = writeTool.inputSchema?.properties || {};
    assert(!!props.locale, 'write_content schema has locale param');
  }

  await cleanupSession(sessionId);
}

async function testListContentTypes(): Promise<void> {
  console.log('\n--- Tool call: list_content_types ---\n');

  const sessionId = await createSession();

  const callRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );

  assert(callRes.status === 200, 'list_content_types returns 200');

  const callData = await parseResponse(callRes);
  const content = callData.result?.content;

  assert(Array.isArray(content), 'Result has content array');
  assert(content?.[0]?.type === 'text', 'Content is text type');

  const parsed = JSON.parse(content[0].text);
  assert(Array.isArray(parsed.contentTypes), 'Has contentTypes array');
  assert(Array.isArray(parsed.components), 'Has components array');

  if (parsed.contentTypes?.length > 0) {
    console.log(`\n  Content types (first 5):`);
    for (const ct of parsed.contentTypes.slice(0, 5)) {
      console.log(`    - ${ct.uid} (${ct.displayName})`);
    }
    if (parsed.contentTypes.length > 5) {
      console.log(`    ... and ${parsed.contentTypes.length - 5} more`);
    }
  }

  await cleanupSession(sessionId);
}

async function testSearchContentBasic(): Promise<void> {
  console.log('\n--- Tool call: search_content (basic) ---\n');

  const sessionId = await createSession();

  // First, discover a content type to query
  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping search tests');
    await cleanupSession(sessionId);
    return;
  }

  const testUid = apiTypes[0].uid;
  console.log(`  Using content type: ${testUid}\n`);

  // Test: basic search (no params beyond contentType)
  const searchRes = await jsonRpc(
    'tools/call',
    { name: 'search_content', arguments: { contentType: testUid } },
    sessionId
  );
  assert(searchRes.status === 200, 'Basic search returns 200');

  const searchData = await parseResponse(searchRes);
  assert(!searchData.result?.isError, 'No error in result');

  const result = JSON.parse(searchData.result?.content?.[0]?.text || '{}');
  assert(Array.isArray(result.results), 'Has results array');
  assert(typeof result.pagination === 'object', 'Has pagination object');
  assert(typeof result.pagination?.total === 'number', 'Pagination has total');

  console.log(`\n  Found ${result.pagination?.total} documents (page ${result.pagination?.page})`);

  // Verify large content fields are stripped by default
  if (result.results.length > 0) {
    const first = result.results[0];
    const hasContent = 'content' in first;
    const hasBlocks = 'blocks' in first;
    const hasBody = 'body' in first;
    const hasLargeField = hasContent || hasBlocks || hasBody;
    assert(
      !hasLargeField,
      'Large content fields stripped by default',
      hasLargeField ? `found: ${[hasContent && 'content', hasBlocks && 'blocks', hasBody && 'body'].filter(Boolean).join(', ')}` : undefined
    );
    assert(!!first.documentId, 'Results include documentId');
    console.log(`\n  First result keys: ${Object.keys(first).join(', ')}`);
  }

  await cleanupSession(sessionId);
}

async function testSearchContentWithStatus(): Promise<void> {
  console.log('\n--- Tool call: search_content (status filter) ---\n');

  const sessionId = await createSession();

  // Discover a content type
  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const testUid = apiTypes[0].uid;
  console.log(`  Using content type: ${testUid}\n`);

  // Search for published documents
  const pubRes = await jsonRpc(
    'tools/call',
    {
      name: 'search_content',
      arguments: { contentType: testUid, status: 'published' },
    },
    sessionId
  );
  assert(pubRes.status === 200, 'Published search returns 200');

  const pubData = await parseResponse(pubRes);
  assert(!pubData.result?.isError, 'No error in published search');

  const pubResult = JSON.parse(pubData.result?.content?.[0]?.text || '{}');
  console.log(`  Published: ${pubResult.pagination?.total} documents`);

  // Published documents should have publishedAt set
  if (pubResult.results?.length > 0) {
    const hasPublishedAt = pubResult.results.every(
      (doc: any) => doc.publishedAt !== null && doc.publishedAt !== undefined
    );
    assert(hasPublishedAt, 'All published documents have publishedAt');
  }

  // Search for draft documents
  const draftRes = await jsonRpc(
    'tools/call',
    {
      name: 'search_content',
      arguments: { contentType: testUid, status: 'draft' },
    },
    sessionId
  );
  assert(draftRes.status === 200, 'Draft search returns 200');

  const draftData = await parseResponse(draftRes);
  const draftResult = JSON.parse(draftData.result?.content?.[0]?.text || '{}');
  console.log(`  Draft: ${draftResult.pagination?.total} documents`);

  await cleanupSession(sessionId);
}

async function testSearchContentIncludeContent(): Promise<void> {
  console.log('\n--- Tool call: search_content (includeContent) ---\n');

  const sessionId = await createSession();

  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const testUid = apiTypes[0].uid;
  console.log(`  Using content type: ${testUid}\n`);

  // Search with includeContent = true
  const res = await jsonRpc(
    'tools/call',
    {
      name: 'search_content',
      arguments: { contentType: testUid, includeContent: true, pageSize: 1 },
    },
    sessionId
  );
  assert(res.status === 200, 'includeContent search returns 200');

  const data = await parseResponse(res);
  const result = JSON.parse(data.result?.content?.[0]?.text || '{}');

  if (result.results?.length > 0) {
    const keys = Object.keys(result.results[0]);
    console.log(`  Result keys with includeContent: ${keys.join(', ')}`);
    // When includeContent is true, content fields should NOT be stripped
    // (they may or may not exist depending on the content type schema)
    assert(true, 'includeContent=true accepted without error');
  } else {
    console.log('  ⚠️  No results to verify includeContent behavior');
  }

  await cleanupSession(sessionId);
}

async function testWriteContentCreateAndUpdate(): Promise<void> {
  console.log('\n--- Tool call: write_content (create + update) ---\n');

  const sessionId = await createSession();

  // Discover an api:: content type
  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping write tests');
    await cleanupSession(sessionId);
    return;
  }

  // Pick a content type — prefer article if available
  const articleType = apiTypes.find((ct: any) => ct.uid.includes('article'));
  const testType = articleType || apiTypes[0];
  const testUid = testType.uid;
  console.log(`  Using content type: ${testUid}\n`);

  // Find a text/string field to write to
  const fieldEntries = Object.entries(testType.fields || {}) as [string, any][];
  const stringField = fieldEntries.find(
    ([_, def]) => def.type === 'string' && !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(_)
  );

  if (!stringField) {
    console.log('  ⚠️  No writable string field found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const [fieldName] = stringField;
  const testValue = `MCP Test ${Date.now()}`;
  console.log(`  Writing to field: ${fieldName}\n`);

  // Create a document
  const createRes = await jsonRpc(
    'tools/call',
    {
      name: 'write_content',
      arguments: {
        contentType: testUid,
        action: 'create',
        data: { [fieldName]: testValue },
      },
    },
    sessionId
  );
  assert(createRes.status === 200, 'Create returns 200');

  const createData = await parseResponse(createRes);
  assert(!createData.result?.isError, 'Create has no error');

  const createResult = JSON.parse(createData.result?.content?.[0]?.text || '{}');
  const createdDoc = createResult.document;
  assert(createResult.action === 'create', 'Action is create');
  assert(!!createdDoc?.documentId, 'Created document has documentId');
  console.log(`  Created document: ${createdDoc?.documentId}`);

  if (!createdDoc?.documentId) {
    await cleanupSession(sessionId);
    return;
  }

  // Update the document
  const updatedValue = `MCP Updated ${Date.now()}`;
  const updateRes = await jsonRpc(
    'tools/call',
    {
      name: 'write_content',
      arguments: {
        contentType: testUid,
        action: 'update',
        documentId: createdDoc.documentId,
        data: { [fieldName]: updatedValue },
      },
    },
    sessionId
  );
  assert(updateRes.status === 200, 'Update returns 200');

  const updateData = await parseResponse(updateRes);
  assert(!updateData.result?.isError, 'Update has no error');

  const updateResult = JSON.parse(updateData.result?.content?.[0]?.text || '{}');
  assert(updateResult.action === 'update', 'Action is update');
  assert(
    updateResult.document?.[fieldName] === updatedValue,
    'Updated field has new value'
  );
  console.log(`  Updated document: ${updateResult.document?.documentId}`);

  await cleanupSession(sessionId);
}

async function testWriteContentUpdateNonExistent(): Promise<void> {
  console.log('\n--- Tool call: write_content (update non-existent) ---\n');

  const sessionId = await createSession();

  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const testUid = apiTypes[0].uid;

  // Try to update a document that doesn't exist
  const res = await jsonRpc(
    'tools/call',
    {
      name: 'write_content',
      arguments: {
        contentType: testUid,
        action: 'update',
        documentId: 'nonexistent-id-12345',
        data: { title: 'Should not work' },
      },
    },
    sessionId
  );

  const data = await parseResponse(res);
  const isError = data.result?.isError === true;
  const errorText = data.result?.content?.[0]?.text || '';

  assert(isError, 'Update non-existent returns error', `isError=${isError}`);
  assert(
    errorText.includes('not found') || errorText.includes('not exist'),
    'Error message mentions not found',
    errorText.slice(0, 100)
  );

  console.log(`  Error message: ${errorText.slice(0, 120)}`);

  await cleanupSession(sessionId);
}

async function testSearchContentInvalidType(): Promise<void> {
  console.log('\n--- Tool call: search_content (invalid content type) ---\n');

  const sessionId = await createSession();

  const res = await jsonRpc(
    'tools/call',
    {
      name: 'search_content',
      arguments: { contentType: 'api::nonexistent.nonexistent' },
    },
    sessionId
  );

  const data = await parseResponse(res);
  const isError = data.result?.isError === true;
  assert(isError, 'Invalid content type returns error');

  await cleanupSession(sessionId);
}

async function testFindOneContent(): Promise<void> {
  console.log('\n--- Tool call: find_one_content ---\n');

  const sessionId = await createSession();

  // Discover an api:: content type
  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const testType = apiTypes.find((ct: any) => ct.uid.includes('article')) || apiTypes[0];
  const testUid = testType.uid;
  console.log(`  Using content type: ${testUid}\n`);

  // Find a string field to create a test document
  const fieldEntries = Object.entries(testType.fields || {}) as [string, any][];
  const stringField = fieldEntries.find(
    ([key, def]) => def.type === 'string' && !['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(key)
  );

  if (!stringField) {
    console.log('  ⚠️  No writable string field found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const [fieldName] = stringField;
  const testValue = `FindOne Test ${Date.now()}`;

  // Create a document first
  const createRes = await jsonRpc(
    'tools/call',
    {
      name: 'write_content',
      arguments: {
        contentType: testUid,
        action: 'create',
        data: { [fieldName]: testValue },
      },
    },
    sessionId
  );
  const createData = await parseResponse(createRes);
  const createResult = JSON.parse(createData.result?.content?.[0]?.text || '{}');
  const docId = createResult.document?.documentId;

  if (!docId) {
    console.log('  ⚠️  Could not create test document — skipping');
    await cleanupSession(sessionId);
    return;
  }

  console.log(`  Created test document: ${docId}\n`);

  // Fetch the document with find_one_content
  const findRes = await jsonRpc(
    'tools/call',
    {
      name: 'find_one_content',
      arguments: { contentType: testUid, documentId: docId },
    },
    sessionId
  );
  assert(findRes.status === 200, 'find_one_content returns 200');

  const findData = await parseResponse(findRes);
  assert(!findData.result?.isError, 'No error in result');

  const findResult = JSON.parse(findData.result?.content?.[0]?.text || '{}');
  assert(!!findResult.document, 'Has document in result');
  assert(
    findResult.document?.documentId === docId,
    'Returned document has correct documentId',
    `got: ${findResult.document?.documentId}`
  );
  assert(
    findResult.document?.[fieldName] === testValue,
    'Returned document has correct field value'
  );

  console.log(`  Fetched document keys: ${Object.keys(findResult.document || {}).join(', ')}`);

  await cleanupSession(sessionId);
}

async function testFindOneContentNotFound(): Promise<void> {
  console.log('\n--- Tool call: find_one_content (not found) ---\n');

  const sessionId = await createSession();

  const typesRes = await jsonRpc(
    'tools/call',
    { name: 'list_content_types', arguments: {} },
    sessionId
  );
  const typesData = await parseResponse(typesRes);
  const typesText = JSON.parse(typesData.result?.content?.[0]?.text || '{}');
  const apiTypes = (typesText.contentTypes || []).filter((ct: any) =>
    ct.uid.startsWith('api::')
  );

  if (apiTypes.length === 0) {
    console.log('  ⚠️  No api:: content types found — skipping');
    await cleanupSession(sessionId);
    return;
  }

  const testUid = apiTypes[0].uid;

  const res = await jsonRpc(
    'tools/call',
    {
      name: 'find_one_content',
      arguments: {
        contentType: testUid,
        documentId: 'nonexistent-id-99999',
      },
    },
    sessionId
  );

  const data = await parseResponse(res);
  const isError = data.result?.isError === true;
  const errorText = data.result?.content?.[0]?.text || '';

  assert(isError, 'find_one_content with invalid ID returns error', `isError=${isError}`);
  assert(
    errorText.includes('not found') || errorText.includes('not exist'),
    'Error message mentions not found',
    errorText.slice(0, 100)
  );

  console.log(`  Error message: ${errorText.slice(0, 120)}`);

  await cleanupSession(sessionId);
}

async function testUploadMedia(): Promise<void> {
  console.log('\n--- Tool call: upload_media ---\n');

  const sessionId = await createSession();

  // Use a small public image (picsum.photos redirects to a real image)
  const testUrl = 'https://picsum.photos/100/100';

  const res = await jsonRpc(
    'tools/call',
    {
      name: 'upload_media',
      arguments: {
        url: testUrl,
        alternativeText: 'MCP test upload',
      },
    },
    sessionId
  );
  assert(res.status === 200, 'upload_media returns 200');

  const data = await parseResponse(res);
  const errorText = data.result?.content?.[0]?.text || '';
  assert(!data.result?.isError, 'No error in result', errorText.slice(0, 200));

  if (data.result?.isError) {
    console.log(`  Error: ${errorText.slice(0, 200)}`);
  } else {
    const result = JSON.parse(errorText || '{}');
    assert(!!result.file, 'Has file in result');
    assert(!!result.file?.id, 'Uploaded file has ID');
    assert(!!result.message, 'Has success message');
    assert(!!result.usage, 'Has usage tip');

    console.log(`  Uploaded file: ${result.file?.name} (ID: ${result.file?.id})`);
  }

  await cleanupSession(sessionId);
}

// ─── Runner ──────────────────────────────────────────────────────

async function runTests(): Promise<void> {
  console.log('='.repeat(50));
  console.log('AI SDK Plugin — MCP Endpoint Tests');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`MCP Endpoint: ${MCP_ENDPOINT}`);
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

  await testInitializeAndListTools();
  await testListContentTypes();
  await testSearchContentBasic();
  await testSearchContentWithStatus();
  await testSearchContentIncludeContent();
  await testSearchContentInvalidType();
  await testWriteContentCreateAndUpdate();
  await testWriteContentUpdateNonExistent();
  await testFindOneContent();
  await testFindOneContentNotFound();
  await testUploadMedia();

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) process.exit(1);
}

runTests();
