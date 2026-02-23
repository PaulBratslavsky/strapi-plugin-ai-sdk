import type { Core } from '@strapi/strapi';
import type { z } from 'zod';

export interface ToolDefinition {
  name: string;
  description: string;
  schema: z.ZodObject<any>;
  execute: (args: any, strapi: Core.Strapi) => Promise<unknown>;
  /** If true, tool is only available in AI SDK chat, not exposed via MCP */
  internal?: boolean;
}

export class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

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
}
