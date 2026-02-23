import type { Core } from '@strapi/strapi';
import { z } from 'zod';

export const writeContentSchema = z.object({
  contentType: z
    .string()
    .describe('Content type UID, e.g. "api::article.article"'),
  action: z
    .enum(['create', 'update'])
    .describe('Whether to create a new document or update an existing one'),
  documentId: z
    .string()
    .optional()
    .describe('Required for update — the document ID to update'),
  data: z
    .record(z.string(), z.unknown())
    .describe('The field values to set. Must match the content type schema.'),
  status: z
    .enum(['draft', 'published'])
    .optional()
    .describe('Document status. Defaults to draft.'),
});

export const writeContentDescription =
  'Create or update a document in any Strapi content type. Use listContentTypes first to discover the schema, and searchContent to find existing documents for updates.';

export interface WriteContentParams {
  contentType: string;
  action: 'create' | 'update';
  documentId?: string;
  data: Record<string, unknown>;
  status?: 'draft' | 'published';
}

export interface WriteContentResult {
  action: 'create' | 'update';
  document: any;
}

/**
 * Core logic for creating/updating content.
 * Shared between AI SDK tool and MCP tool.
 */
export async function writeContent(
  strapi: Core.Strapi,
  params: WriteContentParams
): Promise<WriteContentResult> {
  const { contentType, action, documentId, data, status } = params;

  if (!strapi.contentTypes[contentType as keyof typeof strapi.contentTypes]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }

  if (action === 'update' && !documentId) {
    throw new Error('documentId is required for update actions.');
  }

  const docs = strapi.documents(contentType as any);

  if (action === 'create') {
    const document = await docs.create({
      data,
      ...(status ? { status } : {}),
      populate: '*',
    } as any);
    return { action: 'create', document };
  }

  const document = await docs.update({
    documentId: documentId,
    data,
    ...(status ? { status } : {}),
    populate: '*',
  } as any);
  return { action: 'update', document };
}
