import { aggregateContent, aggregateContentSchema, aggregateContentDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const aggregateContentTool: ToolDefinition = {
  name: 'aggregateContent',
  description: aggregateContentDescription,
  schema: aggregateContentSchema,
  execute: async (args, strapi) => aggregateContent(strapi, args),
  publicSafe: true,
};
