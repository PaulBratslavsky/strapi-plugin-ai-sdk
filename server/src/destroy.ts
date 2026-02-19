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

async function closeSession(strapi: Core.Strapi, sessionId: string, session: MCPSession) {
  try {
    if (session.server) await session.server.close();
    if (session.transport) await session.transport.close();
  } catch (e) {
    strapi.log.warn(`[${PLUGIN_ID}:mcp] Error closing session ${sessionId}`, {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

async function closAllSessions(strapi: Core.Strapi, sessions: Map<string, MCPSession>) {
  const closePromises = [...sessions.entries()].map(
    ([id, session]) => closeSession(strapi, id, session)
  );
  await Promise.all(closePromises);
  sessions.clear();
  strapi.log.info(`[${PLUGIN_ID}:mcp] All MCP sessions closed`);
}

const destroy = async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginWithMCP;

    if (plugin.mcpSessions) {
      await closAllSessions(strapi, plugin.mcpSessions);
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
