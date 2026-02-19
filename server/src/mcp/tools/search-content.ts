import type { Core } from '@strapi/strapi';
import { validateToolInput } from '../schemas';
import { sanitizeOutput } from '../utils/sanitize';
import { searchContent } from '../../tool-logic';

export const searchContentTool = {
  name: 'search_content',
  description:
    'Search and query any Strapi content type. Use list_content_types first to discover available content types and their fields, then use this tool to query specific collections.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      contentType: {
        type: 'string',
        description:
          'The content type UID to search, e.g. "api::article.article" or "plugin::users-permissions.user"',
      },
      query: {
        type: 'string',
        description: 'Full-text search query string (searches across all searchable text fields)',
      },
      filters: {
        type: 'object',
        description: 'Strapi filter object, e.g. { username: { $containsi: "john" } }',
      },
      fields: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific fields to return. If omitted, returns all fields.',
      },
      sort: {
        type: 'string',
        description: 'Sort order, e.g. "createdAt:desc"',
      },
      page: {
        type: 'number',
        description: 'Page number (starts at 1)',
        default: 1,
      },
      pageSize: {
        type: 'number',
        description: 'Results per page (max 50)',
        default: 10,
      },
    },
    required: ['contentType'],
  },
};

export async function handleSearchContent(strapi: Core.Strapi, args: unknown) {
  const validatedArgs = validateToolInput('search_content', args);

  const result = await searchContent(strapi, validatedArgs);

  // Sanitize output to remove private fields
  const sanitizedResults = await sanitizeOutput(strapi, validatedArgs.contentType, result.results);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            data: sanitizedResults,
            pagination: result.pagination,
            uid: validatedArgs.contentType,
          },
          null,
          2
        ),
      },
    ],
  };
}
