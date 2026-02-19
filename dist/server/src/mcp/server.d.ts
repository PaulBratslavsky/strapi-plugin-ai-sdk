import type { Core } from '@strapi/strapi';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Create an MCP server instance configured with Strapi tools.
 * Exposes listContentTypes, searchContent, and writeContent
 * (triggerAnimation is internal to the Strapi admin UI only).
 */
export declare function createMcpServer(strapi: Core.Strapi): McpServer;
