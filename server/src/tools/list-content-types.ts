import type { Core } from '@strapi/strapi';
import { tool, zodSchema } from 'ai';
import { z } from 'zod';
import { listContentTypes } from '../tool-logic';

// Re-export types for backwards compatibility
export type { RelationSummary, ContentTypeSummary, ComponentSummary } from '../tool-logic';

export function createListContentTypesTool(strapi: Core.Strapi) {
  return tool({
    description:
      'List all Strapi content types and components with their fields, relations, and structure.',
    inputSchema: zodSchema(z.object({})),
    execute: async () => listContentTypes(strapi),
  });
}
