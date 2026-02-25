import { findOneContent, findOneContentSchema, findOneContentDescription } from '../../tool-logic';
import { sanitizeOutput } from '../../mcp/utils/sanitize';
import type { ToolDefinition } from '../../lib/tool-registry';

export const findOneContentTool: ToolDefinition = {
  name: 'findOneContent',
  description: findOneContentDescription,
  schema: findOneContentSchema,
  execute: async (args, strapi) => {
    const result = await findOneContent(strapi, args);
    const sanitizedDoc = await sanitizeOutput(strapi, args.contentType, result.document);
    return { ...result, document: sanitizedDoc };
  },
};
