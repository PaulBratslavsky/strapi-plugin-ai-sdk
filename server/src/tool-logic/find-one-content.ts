import type { Core } from '@strapi/strapi';
import { z } from 'zod';

export const findOneContentSchema = z.object({
  contentType: z
    .string()
    .describe(
      'The content type UID to fetch from, e.g. "api::article.article"'
    ),
  documentId: z.string().describe('The document ID to retrieve'),
  populate: z
    .union([z.string(), z.array(z.string()), z.record(z.string(), z.unknown())])
    .optional()
    .default('*')
    .describe(
      'Relations to populate. Defaults to "*" (all). Can be a string, array, or object.'
    ),
  fields: z
    .array(z.string())
    .optional()
    .describe('Specific fields to return. If omitted, returns all fields.'),
  status: z
    .enum(['draft', 'published'])
    .optional()
    .describe('Document status filter.'),
  locale: z
    .string()
    .optional()
    .describe('Locale code for i18n content, e.g. "en" or "fr"'),
});

export const findOneContentDescription =
  'Fetch a single document by its documentId from any Strapi content type. Returns the full document with all fields and populated relations. Use searchContent first to discover document IDs.';

export interface FindOneContentParams {
  contentType: string;
  documentId: string;
  populate?: string | string[] | Record<string, unknown>;
  fields?: string[];
  status?: 'draft' | 'published';
  locale?: string;
}

export interface FindOneContentResult {
  document: any;
}

/**
 * Core logic for fetching a single document by ID.
 * Shared between AI SDK tool and MCP tool.
 */
export async function findOneContent(
  strapi: Core.Strapi,
  params: FindOneContentParams
): Promise<FindOneContentResult> {
  const { contentType, documentId, populate = '*', fields, status, locale } = params;

  if (!strapi.contentTypes[contentType as keyof typeof strapi.contentTypes]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }

  const document = await strapi.documents(contentType as any).findOne({
    documentId,
    ...(fields ? { fields } : {}),
    ...(status ? { status } : {}),
    ...(locale ? { locale } : {}),
    populate,
  } as any);

  if (!document) {
    throw new Error(
      `Document with ID "${documentId}" not found in "${contentType}".`
    );
  }

  return { document };
}
