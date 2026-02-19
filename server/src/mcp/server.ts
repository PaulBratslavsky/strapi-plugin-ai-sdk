import type { Core } from '@strapi/strapi';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { listContentTypes } from '../tool-logic';
import { searchContent } from '../tool-logic';
import { writeContent } from '../tool-logic';
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
      description:
        'List all Strapi content types and components with their fields, relations, and structure.',
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
      description:
        'Search and query any Strapi content type. Use list_content_types first to discover available content types and their fields, then use this tool to query specific collections.',
      inputSchema: {
        contentType: z
          .string()
          .min(1)
          .describe(
            'The content type UID to search, e.g. "api::article.article" or "plugin::users-permissions.user"'
          ),
        query: z
          .string()
          .optional()
          .describe('Full-text search query string (searches across all searchable text fields)'),
        filters: z
          .record(z.string(), z.any())
          .optional()
          .describe('Strapi filter object, e.g. { username: { $containsi: "john" } }'),
        fields: z
          .array(z.string())
          .optional()
          .describe('Specific fields to return. If omitted, returns all fields.'),
        sort: z.string().optional().describe('Sort order, e.g. "createdAt:desc"'),
        page: z.number().int().min(1).optional().default(1).describe('Page number (starts at 1)'),
        pageSize: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .default(10)
          .describe('Results per page (max 50)'),
      },
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
      description:
        'Create or update a document in any Strapi content type. Use list_content_types first to discover the schema, and search_content to find existing documents for updates.',
      inputSchema: {
        contentType: z
          .string()
          .min(1)
          .describe('Content type UID, e.g. "api::article.article"'),
        action: z
          .enum(['create', 'update'])
          .describe('Whether to create a new document or update an existing one'),
        documentId: z
          .string()
          .optional()
          .describe('Required for update - the document ID to update'),
        data: z
          .record(z.string(), z.any())
          .describe('The field values to set. Must match the content type schema.'),
        status: z
          .enum(['draft', 'published'])
          .optional()
          .describe('Document status. Defaults to draft.'),
      },
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
