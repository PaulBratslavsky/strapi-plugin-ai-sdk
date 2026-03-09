import type { ToolDefinition } from '../../lib/tool-registry';
import { listContentTypesTool } from './list-content-types';
import { searchContentTool } from './search-content';
import { createContentTool } from './create-content';
import { updateContentTool } from './update-content';
import { sendEmailTool } from './send-email';
import { saveMemoryTool } from './save-memory';
import { recallMemoriesTool } from './recall-memories';
import { recallPublicMemoriesTool } from './recall-public-memories';
import { findOneContentTool } from './find-one-content';
import { uploadMediaTool } from './upload-media';
import { aggregateContentTool } from './aggregate-content';
import { manageTaskTool } from './manage-task';
import { saveNoteTool } from './save-note';
import { recallNotesTool } from './recall-notes';

/** All built-in tool definitions. Add new tools here. */
export const builtInTools: ToolDefinition[] = [
  listContentTypesTool,
  searchContentTool,
  createContentTool,
  updateContentTool,
  findOneContentTool,
  uploadMediaTool,
  sendEmailTool,
  saveMemoryTool,
  recallMemoriesTool,
  recallPublicMemoriesTool,
  aggregateContentTool,
  manageTaskTool,
  saveNoteTool,
  recallNotesTool,
];
