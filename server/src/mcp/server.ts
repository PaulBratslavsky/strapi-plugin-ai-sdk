import type { Core } from '@strapi/strapi';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listContentTypes,
  listContentTypesSchema,
  listContentTypesDescription,
  searchContent,
  searchContentSchema,
  searchContentDescription,
  writeContent,
  writeContentSchema,
  writeContentDescription,
} from '../tool-logic';
import { sanitizeOutput, sanitizeInput } from './utils/sanitize';

/**
 * Create an MCP server instance configured with Strapi tools.
 * Exposes listContentTypes, searchContent, and writeContent
 * (triggerAnimation is internal to the Strapi admin UI only).
 */
export function createMcpServer(strapi: Core.Strapi): McpServer {
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

  // Register list_content_types tool
  server.registerTool(
    'list_content_types',
    {
      description: listContentTypesDescription,
      inputSchema: listContentTypesSchema.shape,
    },
    async () => {
      strapi.log.debug('[ai-sdk:mcp] Tool call: list_content_types');
      const result = await listContentTypes(strapi);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                ...result,
                count: result.contentTypes.length,
                usage: {
                  tip: 'Use the uid field when calling search_content or write_content tools',
                  example: "search_content with contentType: 'api::article.article'",
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Register search_content tool
  server.registerTool(
    'search_content',
    {
      description: searchContentDescription,
      inputSchema: searchContentSchema.shape,
    },
    async (args) => {
      strapi.log.debug('[ai-sdk:mcp] Tool call: search_content');
      const result = await searchContent(strapi, args);
      const sanitizedResults = await sanitizeOutput(strapi, args.contentType, result.results);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                data: sanitizedResults,
                pagination: result.pagination,
                uid: args.contentType,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Register write_content tool
  server.registerTool(
    'write_content',
    {
      description: writeContentDescription,
      inputSchema: writeContentSchema.shape,
    },
    async (args) => {
      strapi.log.debug('[ai-sdk:mcp] Tool call: write_content');
      const { contentType, action, documentId, data, status } = args;
      const sanitizedData = await sanitizeInput(strapi, contentType, data);
      const result = await writeContent(strapi, {
        contentType,
        action,
        documentId,
        data: sanitizedData,
        status,
      });
      const sanitizedResult = await sanitizeOutput(strapi, contentType, result.document);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                success: true,
                action: result.action,
                data: sanitizedResult,
                uid: contentType,
                ...(documentId ? { documentId } : {}),
                message: `Document ${result.action}d successfully`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  strapi.log.info('[ai-sdk:mcp] MCP server created with tools:', {
    tools: ['list_content_types', 'search_content', 'write_content'],
  });

  return server;
}
