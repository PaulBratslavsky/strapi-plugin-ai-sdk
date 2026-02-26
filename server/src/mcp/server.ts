import type { Core } from '@strapi/strapi';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PluginInstance } from '../lib/types';

/** Convert camelCase to snake_case for MCP tool names */
function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Create an MCP server instance configured with public tools from the registry.
 * Internal tools are excluded.
 */
export function createMcpServer(strapi: Core.Strapi): McpServer {
  const plugin = strapi.plugin('ai-sdk') as unknown as PluginInstance;
  const registry = plugin.toolRegistry;

  if (!registry) {
    throw new Error('Tool registry not initialized');
  }

  const server = new McpServer(
    {
      name: 'ai-sdk-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const toolNames: string[] = [];

  for (const [name, def] of registry.getPublic()) {
    const mcpName = toSnakeCase(name);
    toolNames.push(mcpName);

    server.registerTool(
      mcpName,
      {
        description: def.description,
        inputSchema: def.schema.shape,
      },
      async (args) => {
        strapi.log.debug(`[ai-sdk:mcp] Tool call: ${mcpName}`);
        const result = await def.execute(args, strapi);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    );
  }

  strapi.log.info('[ai-sdk:mcp] MCP server created with tools:', { tools: toolNames });

  return server;
}
