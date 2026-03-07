import { updateContent, updateContentSchema, updateContentDescription } from '../../tool-logic';
import { sanitizeInput, sanitizeOutput } from '../../mcp/utils/sanitize';
import type { ToolDefinition } from '../../lib/tool-registry';

export const updateContentTool: ToolDefinition = {
  name: 'updateContent',
  description: updateContentDescription,
  schema: updateContentSchema,
  execute: async (args, strapi) => {
    const sanitizedData = await sanitizeInput(strapi, args.contentType, args.data);
    const result = await updateContent(strapi, { ...args, data: sanitizedData });
    const sanitizedDoc = await sanitizeOutput(strapi, args.contentType, result.document);
    return { ...result, document: sanitizedDoc };
  },
};
