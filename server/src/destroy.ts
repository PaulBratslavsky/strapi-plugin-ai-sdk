import type { Core } from '@strapi/strapi';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const PLUGIN_ID = 'ai-sdk';

interface MCPSession {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  createdAt: number;
}

interface PluginWithMCP {
  createMcpServer?: (() => McpServer) | null;
  mcpSessions?: Map<string, MCPSession> | null;
}

const destroy = async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginWithMCP;

    // Close all active MCP sessions
    if (plugin.mcpSessions) {
      for (const [sessionId, session] of plugin.mcpSessions) {
        try {
          if (session.server) await session.server.close();
          if (session.transport) await session.transport.close();
        } catch (e) {
          strapi.log.warn(`[${PLUGIN_ID}:mcp] Error closing session ${sessionId}`);
        }
      }
      plugin.mcpSessions.clear();
      strapi.log.info(`[${PLUGIN_ID}:mcp] All MCP sessions closed`);
    }

    plugin.createMcpServer = null;
    plugin.mcpSessions = null;
  } catch (error) {
    strapi.log.error(`[${PLUGIN_ID}:mcp] Error during cleanup`, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export default destroy;
