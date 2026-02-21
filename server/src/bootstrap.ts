import type { Core } from '@strapi/strapi';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp/server';
import { createTTSProvider, type TTSProvider } from './lib/tts';
import type { PluginConfig } from './lib/types';

const PLUGIN_ID = 'ai-sdk';

interface MCPSession {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  createdAt: number;
}

interface PluginWithMCP {
  createMcpServer: () => McpServer;
  mcpSessions: Map<string, MCPSession>;
  ttsProvider?: TTSProvider;
}

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Store the MCP server factory and session map on the plugin instance
  const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginWithMCP;
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  // Initialize TTS provider if configured
  const config = strapi.config.get(`plugin::${PLUGIN_ID}`) as PluginConfig;
  if (config.typecastApiKey && config.typecastActorId) {
    plugin.ttsProvider = createTTSProvider({
      provider: 'typecast',
      apiKey: config.typecastApiKey,
      actorId: config.typecastActorId,
    });
    strapi.log.info(`[${PLUGIN_ID}] TTS provider initialized (typecast)`);
  }

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
