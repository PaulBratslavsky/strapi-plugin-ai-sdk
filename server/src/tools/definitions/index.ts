import type { ToolDefinition } from '../../lib/tool-registry';
import { listContentTypesTool } from './list-content-types';
import { searchContentTool } from './search-content';
import { writeContentTool } from './write-content';
import { triggerAnimationTool } from './trigger-animation';
import { sendEmailTool } from './send-email';

/** All built-in tool definitions. Add new tools here. */
export const builtInTools: ToolDefinition[] = [
  listContentTypesTool,
  searchContentTool,
  writeContentTool,
  triggerAnimationTool,
  sendEmailTool,
];
