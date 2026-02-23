import { writeContent, writeContentSchema, writeContentDescription } from '../../tool-logic';
import { sanitizeInput, sanitizeOutput } from '../../mcp/utils/sanitize';
import type { ToolDefinition } from '../../lib/tool-registry';

export const writeContentTool: ToolDefinition = {
  name: 'writeContent',
  description: writeContentDescription,
  schema: writeContentSchema,
  execute: async (args, strapi) => {
    const sanitizedData = await sanitizeInput(strapi, args.contentType, args.data);
    const result = await writeContent(strapi, { ...args, data: sanitizedData });
    const sanitizedDoc = await sanitizeOutput(strapi, args.contentType, result.document);
    return { ...result, document: sanitizedDoc };
  },
};
