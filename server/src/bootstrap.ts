import type { Core } from '@strapi/strapi';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp/server';

const PLUGIN_ID = 'ai-sdk';

interface MCPSession {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  createdAt: number;
}

interface PluginWithMCP {
  createMcpServer: () => McpServer;
  mcpSessions: Map<string, MCPSession>;
}

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Store the MCP server factory and session map on the plugin instance
  const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginWithMCP;
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
