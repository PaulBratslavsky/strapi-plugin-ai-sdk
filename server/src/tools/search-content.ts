import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { z } from 'zod';
import { searchContent } from '../tool-logic';

export function createSearchContentTool(strapi: Core.Strapi) {
  return tool({
    description:
      'Search and query any Strapi content type. Use listContentTypes first to discover available content types and their fields, then use this tool to query specific collections.',
    inputSchema: zodSchema(
      z.object({
        contentType: z
          .string()
          .describe(
            'The content type UID to search, e.g. "api::article.article" or "plugin::users-permissions.user"'
          ),
        query: z
          .string()
          .optional()
          .describe('Full-text search query string (searches across all searchable text fields)'),
        filters: z
          .record(z.string(), z.unknown())
          .optional()
          .describe(
            'Strapi filter object, e.g. { username: { $containsi: "john" } }'
          ),
        fields: z
          .array(z.string())
          .optional()
          .describe('Specific fields to return. If omitted, returns all fields.'),
        sort: z
          .string()
          .optional()
          .describe('Sort order, e.g. "createdAt:desc"'),
        page: z.number().optional().default(1).describe('Page number (starts at 1)'),
        pageSize: z
          .number()
          .optional()
          .default(10)
          .describe('Results per page (max 50)'),
      })
    ),
    execute: async (params) => searchContent(strapi, params),
  });
}
