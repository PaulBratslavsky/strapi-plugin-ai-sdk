import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { searchContent, searchContentSchema, searchContentDescription } from '../tool-logic';

export function createSearchContentTool(strapi: Core.Strapi) {
  return tool({
    description: searchContentDescription,
    inputSchema: zodSchema(searchContentSchema),
    execute: async (params) => searchContent(strapi, params),
  });
}
