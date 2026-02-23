import { searchContent, searchContentSchema, searchContentDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const searchContentTool: ToolDefinition = {
  name: 'searchContent',
  description: searchContentDescription,
  schema: searchContentSchema,
  execute: async (args, strapi) => searchContent(strapi, args),
};
