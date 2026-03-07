import { createContent, createContentSchema, createContentDescription } from '../../tool-logic';
import { sanitizeInput, sanitizeOutput } from '../../mcp/utils/sanitize';
import type { ToolDefinition } from '../../lib/tool-registry';

export const createContentTool: ToolDefinition = {
  name: 'createContent',
  description: createContentDescription,
  schema: createContentSchema,
  execute: async (args, strapi) => {
    const sanitizedData = await sanitizeInput(strapi, args.contentType, args.data);
    const result = await createContent(strapi, { ...args, data: sanitizedData });
    const sanitizedDoc = await sanitizeOutput(strapi, args.contentType, result.document);
    return { ...result, document: sanitizedDoc };
  },
};
