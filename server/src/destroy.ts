import type { Core } from '@strapi/strapi';
import type { MCPSession, PluginInstance } from './lib/types';

const PLUGIN_ID = 'ai-sdk';

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

async function closeAllSessions(strapi: Core.Strapi, sessions: Map<string, MCPSession>) {
  const closePromises = [...sessions.entries()].map(
    ([id, session]) => closeSession(strapi, id, session)
  );
  await Promise.all(closePromises);
  sessions.clear();
  strapi.log.info(`[${PLUGIN_ID}:mcp] All MCP sessions closed`);
}

const destroy = async ({ strapi }: { strapi: Core.Strapi }) => {
  try {
    const plugin = strapi.plugin(PLUGIN_ID) as unknown as PluginInstance;

    // Clean up AI provider
    if (plugin.aiProvider) {
      plugin.aiProvider.destroy();
      plugin.aiProvider = undefined;
    }

    // Clean up MCP sessions
    if (plugin.mcpSessions) {
      await closeAllSessions(strapi, plugin.mcpSessions);
    }

    plugin.createMcpServer = null;
    plugin.mcpSessions = null;
  } catch (error) {
    strapi.log.error(`[${PLUGIN_ID}] Error during cleanup`, {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export default destroy;
