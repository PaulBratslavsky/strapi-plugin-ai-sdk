import type { Core } from '@strapi/strapi';
import { z } from 'zod';

export const createContentSchema = z.object({
  contentType: z
    .string()
    .describe('Content type UID, e.g. "api::article.article"'),
  data: z
    .record(z.string(), z.unknown())
    .describe('The field values to set. Must match the content type schema.'),
  status: z
    .enum(['draft', 'published'])
    .optional()
    .describe('Document status. Defaults to draft.'),
  locale: z
    .string()
    .optional()
    .describe('Locale code for i18n content, e.g. "en" or "fr"'),
});

export const createContentDescription =
  'Create a new document in any Strapi content type (articles, blog posts, pages, etc.). Use listContentTypes first to discover available content types and their fields.';

export interface CreateContentParams {
  contentType: string;
  data: Record<string, unknown>;
  status?: 'draft' | 'published';
  locale?: string;
}

export interface CreateContentResult {
  action: 'create';
  document: any;
}

/**
 * Core logic for creating content.
 * Shared between AI SDK tool and MCP tool.
 */
export async function createContent(
  strapi: Core.Strapi,
  params: CreateContentParams
): Promise<CreateContentResult> {
  const { contentType, data, status, locale } = params;

  if (!strapi.contentTypes[contentType as keyof typeof strapi.contentTypes]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }

  const docs = strapi.documents(contentType as any);

  const document = await docs.create({
    data,
    ...(status ? { status } : {}),
    ...(locale ? { locale } : {}),
    populate: '*',
  } as any);

  return { action: 'create', document };
}
