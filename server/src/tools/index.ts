import type { Core } from '@strapi/strapi';
import type { ToolSet } from 'ai';
import { tool, zodSchema } from 'ai';
import type { PluginInstance } from '../lib/types';

export function createTools(strapi: Core.Strapi): ToolSet {
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
      execute: async (args: any) => def.execute(args, strapi),
    });
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
