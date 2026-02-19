import type { Core } from '@strapi/strapi';

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
