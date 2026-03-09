import { recallNotes, recallNotesSchema, recallNotesDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const recallNotesTool: ToolDefinition = {
  name: 'recallNotes',
  description: recallNotesDescription,
  schema: recallNotesSchema,
  execute: async (args, strapi, context) => recallNotes(strapi, args, context),
  internal: true,
};
