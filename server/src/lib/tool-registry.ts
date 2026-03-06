import type { Core } from '@strapi/strapi';
import type { z } from 'zod';

export interface ToolContext {
  adminUserId?: number;
  enabledToolSources?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  schema: z.ZodObject<any>;
  execute: (args: any, strapi: Core.Strapi, context?: ToolContext) => Promise<unknown>;
  /** If true, tool is only available in AI SDK chat, not exposed via MCP */
  internal?: boolean;
  /** If true, tool is safe for unauthenticated public chat (read-only) */
  publicSafe?: boolean;
}

/** Type alias for external plugin authors to import when contributing tools */
export type AiToolContribution = ToolDefinition;

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>();

  register(def: ToolDefinition): void {
    this.tools.set(def.name, def);
  }

  unregister(name: string): boolean {
    return this.tools.delete(name);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  /** All registered tools (internal + public) */
  getAll(): Map<string, ToolDefinition> {
    return new Map(this.tools);
  }

  /** Only tools that should be exposed via MCP (non-internal) */
  getPublic(): Map<string, ToolDefinition> {
    const result = new Map<string, ToolDefinition>();
    for (const [name, def] of this.tools) {
      if (!def.internal) {
        result.set(name, def);
      }
    }
    return result;
  }

  /** Returns metadata about tool sources grouped by plugin prefix */
  getToolSources(): Array<{ id: string; label: string; toolCount: number; tools: string[] }> {
    const groups = new Map<string, string[]>();

    for (const name of this.tools.keys()) {
      const sepIndex = name.indexOf('__');
      if (sepIndex === -1) {
        // Built-in tool
        const list = groups.get('built-in') ?? [];
        list.push(name);
        groups.set('built-in', list);
      } else {
        const prefix = name.substring(0, sepIndex);
        const list = groups.get(prefix) ?? [];
        list.push(name);
        groups.set(prefix, list);
      }
    }

    return Array.from(groups.entries()).map(([id, tools]) => ({
      id,
      label: id === 'built-in' ? 'Built-in Tools' : id,
      toolCount: tools.length,
      tools,
    }));
  }

  /** Only tools marked safe for unauthenticated public chat */
  getPublicSafe(): Map<string, ToolDefinition> {
    const result = new Map<string, ToolDefinition>();
    for (const [name, def] of this.tools) {
      if (def.publicSafe) {
        result.set(name, def);
      }
    }
    return result;
  }
}
