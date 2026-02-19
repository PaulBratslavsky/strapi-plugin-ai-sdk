import type { Core } from '@strapi/strapi';
import { createMcpServer } from './mcp/server';

const PLUGIN_ID = 'ai-sdk';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  // Store the MCP server factory and session map on the plugin instance
  const plugin = strapi.plugin(PLUGIN_ID) as any;
  plugin.createMcpServer = () => createMcpServer(strapi);
  plugin.mcpSessions = new Map();

  strapi.log.info(`[${PLUGIN_ID}] MCP endpoint available at: /api/${PLUGIN_ID}/mcp`);
};

export default bootstrap;
