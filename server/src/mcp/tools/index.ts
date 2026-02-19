import type { Core } from '@strapi/strapi';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

import { listContentTypesTool, handleListContentTypes } from './list-content-types';
import { searchContentTool, handleSearchContent } from './search-content';
import { writeContentTool, handleWriteContent } from './write-content';

// Export all tool definitions
export const tools = [listContentTypesTool, searchContentTool, writeContentTool];

// Tool handler registry
const toolHandlers: Record<string, (strapi: Core.Strapi, args: unknown) => Promise<any>> = {
  list_content_types: handleListContentTypes,
  search_content: handleSearchContent,
  write_content: handleWriteContent,
};

/**
 * Handle a tool call by delegating to the appropriate handler
 */
export async function handleToolCall(
  strapi: Core.Strapi,
  request: { params: { name: string; arguments?: Record<string, unknown> } }
) {
  const { name, arguments: args } = request.params;

  const handler = toolHandlers[name];
  if (!handler) {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }

  const startTime = Date.now();
  try {
    const result = await handler(strapi, args || {});
    const duration = Date.now() - startTime;

    strapi.log.debug(`[ai-sdk:mcp] Tool ${name} executed successfully in ${duration}ms`);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    strapi.log.error(`[ai-sdk:mcp] Tool ${name} failed after ${duration}ms`, {
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              error: true,
              message: error instanceof Error ? error.message : String(error),
              tool: name,
            },
            null,
            2
          ),
        },
      ],
    };
  }
}
