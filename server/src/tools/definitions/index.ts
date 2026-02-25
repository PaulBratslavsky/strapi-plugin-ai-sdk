import type { ToolDefinition } from '../../lib/tool-registry';
import { listContentTypesTool } from './list-content-types';
import { searchContentTool } from './search-content';
import { writeContentTool } from './write-content';
import { triggerAnimationTool } from './trigger-animation';
import { sendEmailTool } from './send-email';
import { saveMemoryTool } from './save-memory';
import { recallMemoriesTool } from './recall-memories';
import { findOneContentTool } from './find-one-content';
import { uploadMediaTool } from './upload-media';

/** All built-in tool definitions. Add new tools here. */
export const builtInTools: ToolDefinition[] = [
  listContentTypesTool,
  searchContentTool,
  writeContentTool,
  findOneContentTool,
  uploadMediaTool,
  triggerAnimationTool,
  sendEmailTool,
  saveMemoryTool,
  recallMemoriesTool,
];
