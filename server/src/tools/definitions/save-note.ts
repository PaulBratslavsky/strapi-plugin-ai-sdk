import { saveNote, saveNoteSchema, saveNoteDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const saveNoteTool: ToolDefinition = {
  name: 'saveNote',
  description: saveNoteDescription,
  schema: saveNoteSchema,
  execute: async (args, strapi, context) => saveNote(strapi, args, context),
  internal: true,
};
