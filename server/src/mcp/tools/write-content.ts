import type { Core } from '@strapi/strapi';
import { validateToolInput } from '../schemas';
import { sanitizeInput, sanitizeOutput } from '../utils/sanitize';
import { writeContent } from '../../tool-logic';

export const writeContentTool = {
  name: 'write_content',
  description:
    'Create or update a document in any Strapi content type. Use list_content_types first to discover the schema, and search_content to find existing documents for updates.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      contentType: {
        type: 'string',
        description: 'Content type UID, e.g. "api::article.article"',
      },
      action: {
        type: 'string',
        enum: ['create', 'update'],
        description: 'Whether to create a new document or update an existing one',
      },
      documentId: {
        type: 'string',
        description: 'Required for update - the document ID to update',
      },
      data: {
        type: 'object',
        description: 'The field values to set. Must match the content type schema.',
      },
      status: {
        type: 'string',
        enum: ['draft', 'published'],
        description: 'Document status. Defaults to draft.',
      },
    },
    required: ['contentType', 'action', 'data'],
  },
};

export async function handleWriteContent(strapi: Core.Strapi, args: unknown) {
  const validatedArgs = validateToolInput('write_content', args);
  const { contentType, action, documentId, data, status } = validatedArgs;

  // Sanitize input data before passing to shared logic
  const sanitizedData = await sanitizeInput(strapi, contentType, data);

  const result = await writeContent(strapi, {
    contentType,
    action,
    documentId,
    data: sanitizedData,
    status,
  });

  // Sanitize output
  const sanitizedResult = await sanitizeOutput(strapi, contentType, result.document);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            success: true,
            action: result.action,
            data: sanitizedResult,
            uid: contentType,
            ...(documentId ? { documentId } : {}),
            message: `Document ${result.action}d successfully`,
          },
          null,
          2
        ),
      },
    ],
  };
}
