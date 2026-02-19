import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { z } from 'zod';
import { writeContent } from '../tool-logic';
import { sanitizeInput, sanitizeOutput } from '../mcp/utils/sanitize';

export function createWriteContentTool(strapi: Core.Strapi) {
  return tool({
    description:
      'Create or update a document in any Strapi content type. Use listContentTypes first to discover the schema, and searchContent to find existing documents for updates.',
    inputSchema: zodSchema(
      z.object({
        contentType: z
          .string()
          .describe('Content type UID, e.g. "api::article.article"'),
        action: z
          .enum(['create', 'update'])
          .describe('Whether to create a new document or update an existing one'),
        documentId: z
          .string()
          .optional()
          .describe('Required for update — the document ID to update'),
        data: z
          .record(z.string(), z.unknown())
          .describe('The field values to set. Must match the content type schema.'),
        status: z
          .enum(['draft', 'published'])
          .optional()
          .describe('Document status. Defaults to draft.'),
      })
    ),
    execute: async (params) => {
      const sanitizedData = await sanitizeInput(strapi, params.contentType, params.data);
      const result = await writeContent(strapi, { ...params, data: sanitizedData });
      const sanitizedDoc = await sanitizeOutput(strapi, params.contentType, result.document);
      return { ...result, document: sanitizedDoc };
    },
  });
}
