import type { Core } from '@strapi/strapi';
import type { ToolSet } from 'ai';
import { tool, zodSchema } from 'ai';
import type { PluginInstance } from '../lib/types';
import type { ToolContext } from '../lib/tool-registry';

export function createTools(strapi: Core.Strapi, context?: ToolContext): ToolSet {
  const plugin = strapi.plugin('ai-sdk') as unknown as PluginInstance;
  const registry = plugin.toolRegistry;

  if (!registry) {
    throw new Error('Tool registry not initialized');
  }

  const tools: ToolSet = {};
  for (const [name, def] of registry.getAll()) {
    tools[name] = tool({
      description: def.description,
      inputSchema: zodSchema(def.schema) as any,
      execute: async (args: any) => def.execute(args, strapi, context),
    });
  }

  return tools;
}

/** Content tool names that accept a contentType parameter */
const CONTENT_TOOLS = new Set(['searchContent', 'findOneContent']);

/**
 * Create a restricted tool set for the public chat endpoint.
 * Only includes tools marked as publicSafe.
 * Content tools are wrapped to enforce allowedContentTypes.
 */
export function createPublicTools(strapi: Core.Strapi, allowedContentTypes: string[]): ToolSet {
  const plugin = strapi.plugin('ai-sdk') as unknown as PluginInstance;
  const registry = plugin.toolRegistry;

  if (!registry) {
    throw new Error('Tool registry not initialized');
  }

  const allowed = new Set(allowedContentTypes);
  const tools: ToolSet = {};

  for (const [name, def] of registry.getPublicSafe()) {
    if (CONTENT_TOOLS.has(name)) {
      // Wrap content tools to enforce allowed content types
      tools[name] = tool({
        description: def.description,
        inputSchema: zodSchema(def.schema) as any,
        execute: async (args: any) => {
          if (!args.contentType || !allowed.has(args.contentType)) {
            return { error: `Content type "${args.contentType}" is not available in public chat.` };
          }
          return def.execute(args, strapi);
        },
      });
    } else if (name === 'listContentTypes') {
      // Filter listContentTypes to only show allowed types
      tools[name] = tool({
        description: def.description,
        inputSchema: zodSchema(def.schema) as any,
        execute: async (args: any) => {
          const result = await def.execute(args, strapi) as { contentTypes: { uid: string }[]; components: unknown[] };
          return {
            ...result,
            contentTypes: result.contentTypes.filter((ct: { uid: string }) => allowed.has(ct.uid)),
          };
        },
      });
    } else {
      tools[name] = tool({
        description: def.description,
        inputSchema: zodSchema(def.schema) as any,
        execute: async (args: any) => def.execute(args, strapi),
      });
    }
  }

  return tools;
}

/**
 * Build a system prompt section describing all available tools.
 * Reads the `description` from each tool definition so it stays in sync automatically.
 */
export function describeTools(tools: Record<string, { description?: string }>) {
  const lines = Object.entries(tools).map(
    ([name, t]) => `- ${name}: ${t.description ?? 'No description'}`
  );
  return `Available tools:\n${lines.join('\n')}`;
}
