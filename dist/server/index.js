"use strict";
const index_js = require("@modelcontextprotocol/sdk/server/index.js");
const types_js = require("@modelcontextprotocol/sdk/types.js");
const zod = require("zod");
const anthropic = require("@ai-sdk/anthropic");
const ai = require("ai");
const node_stream = require("node:stream");
const node_crypto = require("node:crypto");
const streamableHttp_js = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const ListContentTypesSchema = zod.z.object({});
const SearchContentSchema = zod.z.object({
  contentType: zod.z.string().min(1, "Content type UID is required"),
  query: zod.z.string().optional(),
  filters: zod.z.record(zod.z.string(), zod.z.any()).optional(),
  fields: zod.z.array(zod.z.string()).optional(),
  sort: zod.z.string().optional(),
  page: zod.z.number().int().min(1).optional().default(1),
  pageSize: zod.z.number().int().min(1).max(50).optional().default(10)
});
const WriteContentSchema = zod.z.object({
  contentType: zod.z.string().min(1, "Content type UID is required"),
  action: zod.z.enum(["create", "update"]),
  documentId: zod.z.string().optional(),
  data: zod.z.record(zod.z.string(), zod.z.any()),
  status: zod.z.enum(["draft", "published"]).optional()
});
const ToolSchemas = {
  list_content_types: ListContentTypesSchema,
  search_content: SearchContentSchema,
  write_content: WriteContentSchema
};
function validateToolInput(toolName, input) {
  const schema = ToolSchemas[toolName];
  const result = schema.safeParse(input);
  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
      return `${path}${err.message}`;
    });
    throw new Error(`Validation failed for ${toolName}:
${errorMessages.join("\n")}`);
  }
  return result.data;
}
const INTERNAL_FIELDS = [
  "createdAt",
  "updatedAt",
  "publishedAt",
  "createdBy",
  "updatedBy",
  "locale",
  "localizations"
];
async function listContentTypes(strapi) {
  const contentTypes2 = strapi.contentTypes;
  const components = strapi.components;
  const apiContentTypes = [];
  for (const [uid, contentType] of Object.entries(contentTypes2)) {
    if (uid.startsWith("admin::") || uid.startsWith("strapi::")) continue;
    const ct = contentType;
    const kind = ct.kind || "collectionType";
    const fields = [];
    const relations = [];
    const usedComponents = [];
    for (const [attrName, attrDef] of Object.entries(ct.attributes || {})) {
      if (INTERNAL_FIELDS.includes(attrName)) continue;
      const attr = attrDef;
      fields.push(attrName);
      if (attr.type === "relation" && attr.target) {
        const targetCt = contentTypes2[attr.target];
        relations.push({
          field: attrName,
          type: attr.relation,
          target: attr.target,
          targetDisplayName: targetCt?.info?.displayName || attr.target
        });
      }
      if (attr.type === "component" && attr.component) {
        if (!usedComponents.includes(attr.component)) {
          usedComponents.push(attr.component);
        }
      }
      if (attr.type === "dynamiczone") {
        for (const comp of attr.components || []) {
          if (!usedComponents.includes(comp)) {
            usedComponents.push(comp);
          }
        }
      }
    }
    apiContentTypes.push({
      uid,
      kind,
      displayName: ct.info?.displayName || uid,
      fields,
      relations,
      components: usedComponents
    });
  }
  apiContentTypes.sort((a, b) => a.displayName.localeCompare(b.displayName));
  const componentSummaries = [];
  for (const [uid, component] of Object.entries(components)) {
    const comp = component;
    componentSummaries.push({
      uid,
      category: comp.category || "default",
      displayName: comp.info?.displayName || uid,
      fieldCount: Object.keys(comp.attributes || {}).length
    });
  }
  componentSummaries.sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    return cat !== 0 ? cat : a.displayName.localeCompare(b.displayName);
  });
  return {
    contentTypes: apiContentTypes,
    components: componentSummaries
  };
}
const MAX_PAGE_SIZE = 50;
async function searchContent(strapi, params) {
  const { contentType, query, filters, fields, sort, page = 1, pageSize = 10 } = params;
  if (!strapi.contentTypes[contentType]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }
  const clampedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);
  const results = await strapi.documents(contentType).findMany({
    ...query ? { _q: query } : {},
    ...filters ? { filters } : {},
    ...fields ? { fields } : {},
    ...sort ? { sort } : {},
    page,
    pageSize: clampedPageSize,
    populate: "*"
  });
  const total = await strapi.documents(contentType).count({
    ...query ? { _q: query } : {},
    ...filters ? { filters } : {}
  });
  return {
    results,
    pagination: {
      page,
      pageSize: clampedPageSize,
      total
    }
  };
}
async function writeContent(strapi, params) {
  const { contentType, action, documentId, data, status } = params;
  if (!strapi.contentTypes[contentType]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }
  if (action === "update" && !documentId) {
    throw new Error("documentId is required for update actions.");
  }
  const docs = strapi.documents(contentType);
  if (action === "create") {
    const document2 = await docs.create({
      data,
      ...status ? { status } : {},
      populate: "*"
    });
    return { action: "create", document: document2 };
  }
  const document = await docs.update({
    documentId,
    data,
    ...status ? { status } : {},
    populate: "*"
  });
  return { action: "update", document };
}
const listContentTypesTool = {
  name: "list_content_types",
  description: "List all Strapi content types and components with their fields, relations, and structure.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
};
async function handleListContentTypes(strapi, args) {
  validateToolInput("list_content_types", args);
  const result = await listContentTypes(strapi);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            ...result,
            count: result.contentTypes.length,
            usage: {
              tip: "Use the uid field when calling search_content or write_content tools",
              example: "search_content with contentType: 'api::article.article'"
            }
          },
          null,
          2
        )
      }
    ]
  };
}
async function sanitizeOutput(strapi, uid, data, auth) {
  if (!data) return data;
  const contentType = strapi.contentType(uid);
  if (!contentType) {
    throw new Error(`Content type "${uid}" not found. Cannot sanitize output.`);
  }
  try {
    return await strapi.contentAPI.sanitize.output(data, contentType, { auth });
  } catch (error) {
    strapi.log.error("[ai-sdk:mcp] Output sanitization failed", {
      uid,
      error: error instanceof Error ? error.message : String(error)
    });
    throw new Error(`Failed to sanitize output for "${uid}". Data not returned for security.`);
  }
}
async function sanitizeInput(strapi, uid, data, auth) {
  if (!data) return data;
  const contentType = strapi.contentType(uid);
  if (!contentType) {
    throw new Error(`Content type "${uid}" not found. Cannot sanitize input.`);
  }
  try {
    return await strapi.contentAPI.sanitize.input(data, contentType, { auth });
  } catch (error) {
    strapi.log.error("[ai-sdk:mcp] Input sanitization failed", {
      uid,
      error: error instanceof Error ? error.message : String(error)
    });
    throw new Error(`Failed to sanitize input for "${uid}". Write operation aborted for security.`);
  }
}
const searchContentTool = {
  name: "search_content",
  description: "Search and query any Strapi content type. Use list_content_types first to discover available content types and their fields, then use this tool to query specific collections.",
  inputSchema: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        description: 'The content type UID to search, e.g. "api::article.article" or "plugin::users-permissions.user"'
      },
      query: {
        type: "string",
        description: "Full-text search query string (searches across all searchable text fields)"
      },
      filters: {
        type: "object",
        description: 'Strapi filter object, e.g. { username: { $containsi: "john" } }'
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description: "Specific fields to return. If omitted, returns all fields."
      },
      sort: {
        type: "string",
        description: 'Sort order, e.g. "createdAt:desc"'
      },
      page: {
        type: "number",
        description: "Page number (starts at 1)",
        default: 1
      },
      pageSize: {
        type: "number",
        description: "Results per page (max 50)",
        default: 10
      }
    },
    required: ["contentType"]
  }
};
async function handleSearchContent(strapi, args) {
  const validatedArgs = validateToolInput("search_content", args);
  const result = await searchContent(strapi, validatedArgs);
  const sanitizedResults = await sanitizeOutput(strapi, validatedArgs.contentType, result.results);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            data: sanitizedResults,
            pagination: result.pagination,
            uid: validatedArgs.contentType
          },
          null,
          2
        )
      }
    ]
  };
}
const writeContentTool = {
  name: "write_content",
  description: "Create or update a document in any Strapi content type. Use list_content_types first to discover the schema, and search_content to find existing documents for updates.",
  inputSchema: {
    type: "object",
    properties: {
      contentType: {
        type: "string",
        description: 'Content type UID, e.g. "api::article.article"'
      },
      action: {
        type: "string",
        enum: ["create", "update"],
        description: "Whether to create a new document or update an existing one"
      },
      documentId: {
        type: "string",
        description: "Required for update - the document ID to update"
      },
      data: {
        type: "object",
        description: "The field values to set. Must match the content type schema."
      },
      status: {
        type: "string",
        enum: ["draft", "published"],
        description: "Document status. Defaults to draft."
      }
    },
    required: ["contentType", "action", "data"]
  }
};
async function handleWriteContent(strapi, args) {
  const validatedArgs = validateToolInput("write_content", args);
  const { contentType, action, documentId, data, status } = validatedArgs;
  const sanitizedData = await sanitizeInput(strapi, contentType, data);
  const result = await writeContent(strapi, {
    contentType,
    action,
    documentId,
    data: sanitizedData,
    status
  });
  const sanitizedResult = await sanitizeOutput(strapi, contentType, result.document);
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            success: true,
            action: result.action,
            data: sanitizedResult,
            uid: contentType,
            ...documentId ? { documentId } : {},
            message: `Document ${result.action}d successfully`
          },
          null,
          2
        )
      }
    ]
  };
}
const tools = [listContentTypesTool, searchContentTool, writeContentTool];
const toolHandlers = {
  list_content_types: handleListContentTypes,
  search_content: handleSearchContent,
  write_content: handleWriteContent
};
async function handleToolCall(strapi, request) {
  const { name, arguments: args } = request.params;
  const handler = toolHandlers[name];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }
  const startTime = Date.now();
  try {
    const result = await handler(strapi, args || {});
    const duration = Date.now() - startTime;
    strapi.log.debug(`[ai-sdk:mcp] Tool ${name} executed successfully in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    strapi.log.error(`[ai-sdk:mcp] Tool ${name} failed after ${duration}ms`, {
      error: error instanceof Error ? error.message : String(error)
    });
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: true,
              message: error instanceof Error ? error.message : String(error),
              tool: name
            },
            null,
            2
          )
        }
      ]
    };
  }
}
function createMcpServer(strapi) {
  const server = new index_js.Server(
    {
      name: "ai-sdk-mcp",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );
  server.setRequestHandler(types_js.ListToolsRequestSchema, async () => {
    strapi.log.debug("[ai-sdk:mcp] Listing tools");
    return { tools };
  });
  server.setRequestHandler(types_js.CallToolRequestSchema, async (request) => {
    strapi.log.debug(`[ai-sdk:mcp] Tool call: ${request.params.name}`);
    return handleToolCall(strapi, request);
  });
  strapi.log.info("[ai-sdk:mcp] MCP server created with tools:", {
    tools: tools.map((t) => t.name)
  });
  return server;
}
const PLUGIN_ID$2 = "ai-sdk";
const bootstrap = ({ strapi }) => {
  const plugin = strapi.plugin(PLUGIN_ID$2);
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = /* @__PURE__ */ new Map();
  strapi.log.info(`[${PLUGIN_ID$2}] MCP endpoint available at: /api/${PLUGIN_ID$2}/mcp`);
};
const PLUGIN_ID$1 = "ai-sdk";
const destroy = async ({ strapi }) => {
  try {
    const plugin = strapi.plugin(PLUGIN_ID$1);
    if (plugin.mcpSessions) {
      for (const [sessionId, session] of plugin.mcpSessions) {
        try {
          if (session.server) await session.server.close();
          if (session.transport) await session.transport.close();
        } catch (e) {
          strapi.log.warn(`[${PLUGIN_ID$1}:mcp] Error closing session ${sessionId}`);
        }
      }
      plugin.mcpSessions.clear();
      strapi.log.info(`[${PLUGIN_ID$1}:mcp] All MCP sessions closed`);
    }
    plugin.createMcpServer = null;
    plugin.mcpSessions = null;
  } catch (error) {
    strapi.log.error(`[${PLUGIN_ID$1}:mcp] Error during cleanup`, {
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
const CHAT_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
  "claude-3-haiku-20240307"
];
const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_TEMPERATURE = 0.7;
function isPromptInput(input) {
  return "prompt" in input;
}
class AISDKManager {
  constructor() {
    this.provider = null;
    this.model = DEFAULT_MODEL;
  }
  /**
   * Initialize the manager with plugin configuration
   * Returns false if config is missing required fields
   */
  initialize(config2) {
    const cfg = config2;
    if (!cfg?.anthropicApiKey) {
      return false;
    }
    this.provider = anthropic.createAnthropic({
      apiKey: cfg.anthropicApiKey,
      baseURL: cfg.baseURL
    });
    if (cfg.chatModel && CHAT_MODELS.includes(cfg.chatModel)) {
      this.model = cfg.chatModel;
    }
    return true;
  }
  getLanguageModel() {
    if (!this.provider) {
      throw new Error("AI SDK Manager not initialized");
    }
    return this.provider(this.model);
  }
  buildParams(input) {
    const base = {
      model: this.getLanguageModel(),
      system: input.system,
      temperature: input.temperature ?? DEFAULT_TEMPERATURE,
      maxOutputTokens: input.maxOutputTokens,
      tools: input.tools,
      stopWhen: input.stopWhen
    };
    return isPromptInput(input) ? { ...base, prompt: input.prompt } : { ...base, messages: input.messages };
  }
  async generate(input) {
    const result = await ai.generateText(this.buildParams(input));
    return { text: result.text };
  }
  async stream(input) {
    const result = ai.streamText(this.buildParams(input));
    return { textStream: result.textStream };
  }
  /**
   * Returns the raw streamText result for use with toUIMessageStreamResponse()
   * Compatible with AI SDK UI hooks (useChat, useCompletion)
   */
  streamRaw(input) {
    return ai.streamText(this.buildParams(input));
  }
  // Convenience methods for simple prompt-based calls
  async generateText(prompt, options) {
    return this.generate({ prompt, ...options });
  }
  async streamText(prompt, options) {
    return this.stream({ prompt, ...options });
  }
  getChatModel() {
    return this.model;
  }
  isInitialized() {
    return this.provider !== null;
  }
  destroy() {
    this.provider = null;
  }
}
const aiSDKManager = new AISDKManager();
const register = ({ strapi }) => {
  const config2 = strapi.config.get("plugin::ai-sdk");
  const initialized = aiSDKManager.initialize(config2);
  if (!initialized) {
    strapi.log.warn("AI SDK plugin: anthropicApiKey not configured, plugin will not be initialized");
    return;
  }
  strapi.log.info(`AI SDK plugin initialized with model: ${aiSDKManager.getChatModel()}`);
};
const config = {
  default: {
    anthropicApiKey: "",
    chatModel: "claude-sonnet-4-20250514",
    baseURL: void 0,
    systemPrompt: ""
  },
  validator(config2) {
    if (typeof config2 !== "object" || config2 === null) {
      throw new Error("Config must be an object");
    }
  }
};
const contentTypes = {};
function getService(strapi, ctx) {
  const service2 = strapi.plugin("ai-sdk").service("service");
  if (!service2.isInitialized()) {
    ctx.badRequest("AI SDK not initialized. Check plugin configuration.");
    return null;
  }
  return service2;
}
function validateBody(ctx) {
  const { prompt, system } = ctx.request.body;
  if (!prompt || typeof prompt !== "string") {
    ctx.badRequest("prompt is required and must be a string");
    return null;
  }
  return { prompt, system };
}
function validateChatBody(ctx) {
  const { messages, system } = ctx.request.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    ctx.badRequest("messages is required and must be a non-empty array");
    return null;
  }
  return { messages, system };
}
function createSSEStream(ctx) {
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const stream = new node_stream.PassThrough();
  ctx.body = stream;
  ctx.res.flushHeaders();
  return stream;
}
function writeSSE(stream, data) {
  stream.write(`data: ${JSON.stringify(data)}

`);
}
const controller = ({ strapi }) => ({
  async ask(ctx) {
    const body = validateBody(ctx);
    if (!body) return;
    const service2 = getService(strapi, ctx);
    if (!service2) return;
    const result = await service2.ask(body.prompt, { system: body.system });
    ctx.body = { data: { text: result } };
  },
  async askStream(ctx) {
    const body = validateBody(ctx);
    if (!body) return;
    const service2 = getService(strapi, ctx);
    if (!service2) return;
    const textStream = await service2.askStream(body.prompt, { system: body.system });
    const stream = createSSEStream(ctx);
    void (async () => {
      try {
        for await (const chunk of textStream) {
          writeSSE(stream, { text: chunk });
        }
        stream.write("data: [DONE]\n\n");
      } catch (error) {
        strapi.log.error("AI SDK stream error:", error);
        writeSSE(stream, { error: "Stream error" });
      } finally {
        stream.end();
      }
    })();
  },
  /**
   * Chat endpoint using AI SDK UI message stream protocol
   * Compatible with useChat hook from @ai-sdk/react
   */
  async chat(ctx) {
    const body = validateChatBody(ctx);
    if (!body) return;
    const service2 = getService(strapi, ctx);
    if (!service2) return;
    const config2 = strapi.config.get("plugin::ai-sdk");
    const system = body.system || config2.systemPrompt || void 0;
    const result = await service2.chat(body.messages, { system });
    const response = result.toUIMessageStreamResponse();
    ctx.status = 200;
    ctx.set("Content-Type", "text/event-stream; charset=utf-8");
    ctx.set("Cache-Control", "no-cache, no-transform");
    ctx.set("Connection", "keep-alive");
    ctx.set("X-Accel-Buffering", "no");
    ctx.set("x-vercel-ai-ui-message-stream", "v1");
    ctx.body = node_stream.Readable.fromWeb(response.body);
  }
});
const PLUGIN_ID = "ai-sdk";
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1e3;
function isSessionExpired(session) {
  return Date.now() - session.createdAt > SESSION_TIMEOUT_MS;
}
function cleanupExpiredSessions(plugin, strapi) {
  let cleaned = 0;
  for (const [sessionId, session] of plugin.mcpSessions.entries()) {
    if (isSessionExpired(session)) {
      try {
        session.server.close();
      } catch {
      }
      plugin.mcpSessions.delete(sessionId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    strapi.log.debug(`[${PLUGIN_ID}:mcp] Cleaned up ${cleaned} expired sessions`);
  }
}
const mcpController = ({ strapi }) => ({
  /**
   * Handle MCP requests (POST, GET, DELETE).
   * Creates a new server+transport per session for proper isolation.
   */
  async handle(ctx) {
    const plugin = strapi.plugin(PLUGIN_ID);
    if (!plugin.createMcpServer) {
      ctx.status = 503;
      ctx.body = {
        error: "MCP not initialized",
        message: "The MCP server is not available. Check plugin configuration."
      };
      return;
    }
    if (Math.random() < 0.01) {
      cleanupExpiredSessions(plugin, strapi);
    }
    try {
      const requestedSessionId = ctx.request.headers["mcp-session-id"];
      let session = requestedSessionId ? plugin.mcpSessions.get(requestedSessionId) : null;
      if (session && isSessionExpired(session)) {
        strapi.log.debug(`[${PLUGIN_ID}:mcp] Session expired, removing: ${requestedSessionId}`);
        try {
          session.server.close();
        } catch {
        }
        plugin.mcpSessions.delete(requestedSessionId);
        session = null;
      }
      if (requestedSessionId && !session) {
        ctx.status = 400;
        ctx.body = {
          jsonrpc: "2.0",
          error: {
            code: -32e3,
            message: "Session expired or invalid. Please reinitialize the connection."
          },
          id: null
        };
        return;
      }
      if (!session) {
        const sessionId = node_crypto.randomUUID();
        const server = plugin.createMcpServer();
        const transport = new streamableHttp_js.StreamableHTTPServerTransport({
          sessionIdGenerator: () => sessionId
        });
        await server.connect(transport);
        session = { server, transport, createdAt: Date.now() };
        plugin.mcpSessions.set(sessionId, session);
        strapi.log.debug(`[${PLUGIN_ID}:mcp] New session created: ${sessionId}`);
      }
      try {
        await session.transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
      } catch (transportError) {
        strapi.log.warn(`[${PLUGIN_ID}:mcp] Transport error, cleaning up session: ${requestedSessionId}`, {
          error: transportError instanceof Error ? transportError.message : String(transportError)
        });
        try {
          session.server.close();
        } catch {
        }
        plugin.mcpSessions.delete(requestedSessionId);
        if (!ctx.res.headersSent) {
          ctx.status = 400;
          ctx.body = {
            jsonrpc: "2.0",
            error: {
              code: -32e3,
              message: "Session transport error. Please reinitialize the connection."
            },
            id: null
          };
        }
        return;
      }
      ctx.respond = false;
    } catch (error) {
      strapi.log.error(`[${PLUGIN_ID}:mcp] Error handling MCP request`, {
        error: error instanceof Error ? error.message : String(error),
        method: ctx.method,
        path: ctx.path
      });
      if (!ctx.res.headersSent) {
        ctx.status = 500;
        ctx.body = {
          error: "MCP request failed",
          message: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }
  }
});
const controllers = {
  controller,
  mcp: mcpController
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = {
  type: "content-api",
  routes: [
    {
      method: "POST",
      path: "/ask",
      handler: "controller.ask",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/ask-stream",
      handler: "controller.askStream",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/chat",
      handler: "controller.chat",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/mcp",
      handler: "mcp.handle",
      config: {
        policies: []
      }
    },
    {
      method: "GET",
      path: "/mcp",
      handler: "mcp.handle",
      config: {
        policies: []
      }
    },
    {
      method: "DELETE",
      path: "/mcp",
      handler: "mcp.handle",
      config: {
        policies: []
      }
    }
  ]
};
const adminAPIRoutes = {
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/chat",
      handler: "controller.chat",
      config: {
        policies: []
      }
    }
  ]
};
const routes = {
  "content-api": contentAPIRoutes,
  admin: adminAPIRoutes
};
function createListContentTypesTool(strapi) {
  return ai.tool({
    description: "List all Strapi content types and components with their fields, relations, and structure.",
    inputSchema: ai.zodSchema(zod.z.object({})),
    execute: async () => listContentTypes(strapi)
  });
}
function createSearchContentTool(strapi) {
  return ai.tool({
    description: "Search and query any Strapi content type. Use listContentTypes first to discover available content types and their fields, then use this tool to query specific collections.",
    inputSchema: ai.zodSchema(
      zod.z.object({
        contentType: zod.z.string().describe(
          'The content type UID to search, e.g. "api::article.article" or "plugin::users-permissions.user"'
        ),
        query: zod.z.string().optional().describe("Full-text search query string (searches across all searchable text fields)"),
        filters: zod.z.record(zod.z.string(), zod.z.unknown()).optional().describe(
          'Strapi filter object, e.g. { username: { $containsi: "john" } }'
        ),
        fields: zod.z.array(zod.z.string()).optional().describe("Specific fields to return. If omitted, returns all fields."),
        sort: zod.z.string().optional().describe('Sort order, e.g. "createdAt:desc"'),
        page: zod.z.number().optional().default(1).describe("Page number (starts at 1)"),
        pageSize: zod.z.number().optional().default(10).describe("Results per page (max 50)")
      })
    ),
    execute: async (params) => searchContent(strapi, params)
  });
}
function createWriteContentTool(strapi) {
  return ai.tool({
    description: "Create or update a document in any Strapi content type. Use listContentTypes first to discover the schema, and searchContent to find existing documents for updates.",
    inputSchema: ai.zodSchema(
      zod.z.object({
        contentType: zod.z.string().describe('Content type UID, e.g. "api::article.article"'),
        action: zod.z.enum(["create", "update"]).describe("Whether to create a new document or update an existing one"),
        documentId: zod.z.string().optional().describe("Required for update — the document ID to update"),
        data: zod.z.record(zod.z.string(), zod.z.unknown()).describe("The field values to set. Must match the content type schema."),
        status: zod.z.enum(["draft", "published"]).optional().describe("Document status. Defaults to draft.")
      })
    ),
    execute: async (params) => writeContent(strapi, params)
  });
}
function createTriggerAnimationTool() {
  return ai.tool({
    description: [
      "Trigger a 3D avatar animation on the client. ALWAYS call this at the start of every response.",
      "Available animations and when to use them:",
      "- speak: DEFAULT — use this for all normal responses (head nods, arm gestures, like talking)",
      "- wave: greeting the user or saying hello/goodbye",
      "- nod: agreeing, confirming, or acknowledging something",
      "- think: considering a question, pondering, or working through a problem",
      "- celebrate: task completed successfully, good news, or congratulations",
      "- shake: disagreeing, saying no, or indicating something is wrong",
      "- spin: when the user asks you to spin or do a twirl",
      "- idle: return to default resting pose",
      'When in doubt, use "speak". Use specific animations only for strong emotional moments.'
    ].join("\n"),
    inputSchema: ai.zodSchema(
      zod.z.object({
        animation: zod.z.enum(["idle", "speak", "wave", "nod", "think", "celebrate", "shake", "spin"]).describe("The animation to play on the 3D avatar")
      })
    ),
    execute: async ({ animation }) => {
      return { triggered: animation, status: "playing" };
    }
  });
}
function createTools(strapi) {
  return {
    listContentTypes: createListContentTypesTool(strapi),
    searchContent: createSearchContentTool(strapi),
    writeContent: createWriteContentTool(strapi),
    triggerAnimation: createTriggerAnimationTool()
  };
}
function describeTools(tools2) {
  const lines = Object.entries(tools2).map(
    ([name, t]) => `- ${name}: ${t.description ?? "No description"}`
  );
  return `You are a Strapi CMS assistant. You have these tools:
${lines.join("\n")}

Use them to fulfill user requests. When asked to create or update content, use the appropriate tool — do not tell the user you cannot.`;
}
const service = ({ strapi }) => ({
  async ask(prompt, options) {
    const result = await aiSDKManager.generateText(prompt, {
      system: options?.system
    });
    return result.text;
  },
  async askStream(prompt, options) {
    const result = await aiSDKManager.streamText(prompt, {
      system: options?.system
    });
    return result.textStream;
  },
  /**
   * Chat with messages - returns raw stream for UI message stream response
   * Compatible with AI SDK UI hooks (useChat)
   */
  async chat(messages, options) {
    const modelMessages = await ai.convertToModelMessages(messages);
    const tools2 = createTools(strapi);
    const toolsPrompt = describeTools(tools2);
    const system = options?.system ? `${options.system}

${toolsPrompt}` : toolsPrompt;
    return aiSDKManager.streamRaw({
      messages: modelMessages,
      system,
      tools: tools2,
      stopWhen: ai.stepCountIs(6)
    });
  },
  isInitialized() {
    return aiSDKManager.isInitialized();
  }
});
const services = {
  service
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
module.exports = index;
