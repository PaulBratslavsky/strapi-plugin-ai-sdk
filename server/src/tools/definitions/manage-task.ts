import { manageTask, manageTaskSchema, manageTaskDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const manageTaskTool: ToolDefinition = {
  name: 'manageTask',
  description: manageTaskDescription,
  schema: manageTaskSchema,
  execute: async (args, strapi, context) => manageTask(strapi, args, context),
  internal: true,
};
