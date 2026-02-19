import type { Core } from '@strapi/strapi';

const PLUGIN_ID = 'ai-sdk';

const destroy = async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    const plugin = strapi.plugin(PLUGIN_ID) as any;

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
