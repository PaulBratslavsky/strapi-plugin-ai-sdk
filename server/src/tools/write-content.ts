import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { writeContent, writeContentSchema, writeContentDescription } from '../tool-logic';
import { sanitizeInput, sanitizeOutput } from '../mcp/utils/sanitize';

export function createWriteContentTool(strapi: Core.Strapi) {
  return tool({
    description: writeContentDescription,
    inputSchema: zodSchema(writeContentSchema),
    execute: async (params) => {
      const sanitizedData = await sanitizeInput(strapi, params.contentType, params.data);
      const result = await writeContent(strapi, { ...params, data: sanitizedData });
      const sanitizedDoc = await sanitizeOutput(strapi, params.contentType, result.document);
      return { ...result, document: sanitizedDoc };
    },
  });
}
