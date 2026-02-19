import type { Core } from '@strapi/strapi';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

const PLUGIN_ID = 'ai-sdk';

// Session timeout: 4 hours
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000;

// Maximum concurrent MCP sessions
const MAX_SESSIONS = 100;

function isSessionExpired(session: { createdAt: number }): boolean {
  return Date.now() - session.createdAt > SESSION_TIMEOUT_MS;
}

function cleanupExpiredSessions(plugin: any, strapi: Core.Strapi): void {
  let cleaned = 0;
  for (const [sessionId, session] of plugin.mcpSessions.entries()) {
    if (isSessionExpired(session)) {
      try {
        session.server.close();
      } catch {
        // Ignore close errors
      }
      plugin.mcpSessions.delete(sessionId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    strapi.log.debug(`[${PLUGIN_ID}:mcp] Cleaned up ${cleaned} expired sessions`);
  }
}

const mcpController = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Handle MCP requests (POST, GET, DELETE).
   * Creates a new server+transport per session for proper isolation.
   */
  async handle(ctx: any) {
    const plugin = strapi.plugin(PLUGIN_ID) as any;

    if (!plugin.createMcpServer) {
      ctx.status = 503;
      ctx.body = {
        error: 'MCP not initialized',
        message: 'The MCP server is not available. Check plugin configuration.',
      };
      return;
    }

    // Periodically clean up expired sessions
    if (Math.random() < 0.01) {
      cleanupExpiredSessions(plugin, strapi);
    }

    try {
      const requestedSessionId = ctx.request.headers['mcp-session-id'];
      let session = requestedSessionId ? plugin.mcpSessions.get(requestedSessionId) : null;

      // Check if session is expired
      if (session && isSessionExpired(session)) {
        strapi.log.debug(`[${PLUGIN_ID}:mcp] Session expired, removing: ${requestedSessionId}`);
        try {
          session.server.close();
        } catch {
          // Ignore close errors
        }
        plugin.mcpSessions.delete(requestedSessionId);
        session = null;
      }

      // If client sent a session ID but session doesn't exist, return error
      if (requestedSessionId && !session) {
        ctx.status = 400;
        ctx.body = {
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Session expired or invalid. Please reinitialize the connection.',
          },
          id: null,
        };
        return;
      }

      // Track the actual session ID in use
      let currentSessionId = requestedSessionId;

      // Create new session if none exists
      if (!session) {
        // Enforce session limit
        if (plugin.mcpSessions.size >= MAX_SESSIONS) {
          cleanupExpiredSessions(plugin, strapi);
          if (plugin.mcpSessions.size >= MAX_SESSIONS) {
            ctx.status = 429;
            ctx.body = {
              jsonrpc: '2.0',
              error: {
                code: -32000,
                message: 'Too many active sessions. Please try again later.',
              },
              id: null,
            };
            return;
          }
        }

        const sessionId = randomUUID();
        currentSessionId = sessionId;
        const server = plugin.createMcpServer();
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => sessionId,
        });

        await server.connect(transport);

        session = { server, transport, createdAt: Date.now() };
        plugin.mcpSessions.set(sessionId, session);

        strapi.log.debug(`[${PLUGIN_ID}:mcp] New session created: ${sessionId}`);
      }

      // Handle the request
      try {
        await session.transport.handleRequest(ctx.req, ctx.res, ctx.request.body);
      } catch (transportError) {
        strapi.log.warn(`[${PLUGIN_ID}:mcp] Transport error, cleaning up session: ${currentSessionId}`, {
          error: transportError instanceof Error ? transportError.message : String(transportError),
        });

        try {
          session.server.close();
        } catch {
          // Ignore close errors
        }
        plugin.mcpSessions.delete(currentSessionId);

        if (!ctx.res.headersSent) {
          ctx.status = 400;
          ctx.body = {
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Session transport error. Please reinitialize the connection.',
            },
            id: null,
          };
        }
        return;
      }

      // Prevent Koa from handling response (MCP SDK writes directly)
      ctx.respond = false;
    } catch (error) {
      strapi.log.error(`[${PLUGIN_ID}:mcp] Error handling MCP request`, {
        error: error instanceof Error ? error.message : String(error),
        method: ctx.method,
        path: ctx.path,
      });

      if (!ctx.res.headersSent) {
        ctx.status = 500;
        ctx.body = {
          error: 'MCP request failed',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  },
});

export default mcpController;
