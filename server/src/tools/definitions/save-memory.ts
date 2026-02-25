import { saveMemory, saveMemorySchema, saveMemoryDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const saveMemoryTool: ToolDefinition = {
  name: 'saveMemory',
  description: saveMemoryDescription,
  schema: saveMemorySchema,
  execute: async (args, strapi, context) => saveMemory(strapi, args, context),
  internal: true,
};
