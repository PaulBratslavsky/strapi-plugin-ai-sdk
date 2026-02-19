import type { Core } from '@strapi/strapi';
import { validateToolInput } from '../schemas';
import { listContentTypes } from '../../tool-logic';

export const listContentTypesTool = {
  name: 'list_content_types',
  description:
    'List all Strapi content types and components with their fields, relations, and structure.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
  },
};

export async function handleListContentTypes(strapi: Core.Strapi, args: unknown) {
  validateToolInput('list_content_types', args);

  const result = await listContentTypes(strapi);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            ...result,
            count: result.contentTypes.length,
            usage: {
              tip: 'Use the uid field when calling search_content or write_content tools',
              example: "search_content with contentType: 'api::article.article'",
            },
          },
          null,
          2
        ),
      },
    ],
  };
}
