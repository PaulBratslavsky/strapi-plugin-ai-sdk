import { recallPublicMemories, recallPublicMemoriesSchema, recallPublicMemoriesDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const recallPublicMemoriesTool: ToolDefinition = {
  name: 'recallPublicMemories',
  description: recallPublicMemoriesDescription,
  schema: recallPublicMemoriesSchema,
  execute: async (args, strapi) => recallPublicMemories(strapi, args),
  internal: true,
  publicSafe: true,
};
