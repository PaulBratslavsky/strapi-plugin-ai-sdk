import type { Core } from '@strapi/strapi';

const MAX_PAGE_SIZE = 50;

export interface SearchContentParams {
  contentType: string;
  query?: string;
  filters?: Record<string, unknown>;
  fields?: string[];
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchContentResult {
  results: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

/**
 * Core logic for searching content.
 * Shared between AI SDK tool and MCP tool.
 */
export async function searchContent(
  strapi: Core.Strapi,
  params: SearchContentParams
): Promise<SearchContentResult> {
  const { contentType, query, filters, fields, sort, page = 1, pageSize = 10 } = params;

  if (!strapi.contentTypes[contentType as keyof typeof strapi.contentTypes]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }

  const clampedPageSize = Math.min(pageSize, MAX_PAGE_SIZE);

  const results = await strapi.documents(contentType as any).findMany({
    ...(query ? { _q: query } : {}),
    ...(filters ? { filters } : {}),
    ...(fields ? { fields } : {}),
    ...(sort ? { sort } : {}),
    page,
    pageSize: clampedPageSize,
    populate: '*',
  } as any);

  const total = await strapi.documents(contentType as any).count({
    ...(query ? { _q: query } : {}),
    ...(filters ? { filters } : {}),
  } as any);

  return {
    results,
    pagination: {
      page,
      pageSize: clampedPageSize,
      total,
    },
  };
}
