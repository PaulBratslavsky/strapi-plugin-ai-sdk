import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { listContentTypes, listContentTypesSchema, listContentTypesDescription } from '../tool-logic';

// Re-export types for backwards compatibility
export type { RelationSummary, ContentTypeSummary, ComponentSummary } from '../tool-logic';

export function createListContentTypesTool(strapi: Core.Strapi) {
  return tool({
    description: listContentTypesDescription,
    inputSchema: zodSchema(listContentTypesSchema),
    execute: async () => listContentTypes(strapi),
  });
}
