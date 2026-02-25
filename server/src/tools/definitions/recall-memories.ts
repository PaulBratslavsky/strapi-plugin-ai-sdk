import { recallMemories, recallMemoriesSchema, recallMemoriesDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const recallMemoriesTool: ToolDefinition = {
  name: 'recallMemories',
  description: recallMemoriesDescription,
  schema: recallMemoriesSchema,
  execute: async (args, strapi, context) => recallMemories(strapi, args, context),
  internal: true,
};
