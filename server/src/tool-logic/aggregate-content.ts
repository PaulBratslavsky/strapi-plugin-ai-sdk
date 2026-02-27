import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { resolveFieldPath } from './schema-utils';

const MAX_PAGINATE = 1000;
const PAGE_SIZE = 100;

export const aggregateContentSchema = z.object({
  contentType: z
    .string()
    .describe('The content type UID, e.g. "api::article.article"'),
  operation: z
    .enum(['count', 'countByField', 'countByDateRange'])
    .describe(
      'count — total count; countByField — group by a field; countByDateRange — bucket by date'
    ),
  filters: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Strapi filter object, e.g. { category: { name: "tech" } }'),
  groupByField: z
    .string()
    .optional()
    .describe('Field to group by for countByField. Just use the field name — relation fields are auto-resolved to their display name (e.g. "author", "category"). You can also use dot paths like "author.email" for a specific sub-field.'),
  dateField: z
    .string()
    .optional()
    .default('createdAt')
    .describe('Date field for countByDateRange (default: "createdAt")'),
  granularity: z
    .enum(['day', 'week', 'month'])
    .optional()
    .default('month')
    .describe('Bucket granularity for countByDateRange'),
  dateFrom: z
    .string()
    .optional()
    .describe('ISO date string lower bound (inclusive)'),
  dateTo: z
    .string()
    .optional()
    .describe('ISO date string upper bound (inclusive)'),
  status: z
    .enum(['draft', 'published'])
    .optional()
    .describe('Filter by document status'),
  locale: z
    .string()
    .optional()
    .describe('Locale code for i18n content'),
});

export const aggregateContentDescription =
  'Aggregate and count content entries. Use for analytics questions like "how many articles per category", "content trends by month", or total counts with filters. Prefer this over searchContent for counting and grouping.';

export interface AggregateContentParams {
  contentType: string;
  operation: 'count' | 'countByField' | 'countByDateRange';
  filters?: Record<string, unknown>;
  groupByField?: string;
  dateField?: string;
  granularity?: 'day' | 'week' | 'month';
  dateFrom?: string;
  dateTo?: string;
  status?: 'draft' | 'published';
  locale?: string;
}

export interface AggregateContentResult {
  total?: number;
  groups?: { value: string; count: number }[];
  buckets?: { period: string; count: number }[];
  /** The field path actually used (after schema auto-resolution) */
  resolvedField?: string;
}

function buildBaseQuery(params: AggregateContentParams) {
  const { filters, status, locale, dateFrom, dateTo, dateField = 'createdAt' } = params;
  const query: Record<string, unknown> = {};
  const mergedFilters: Record<string, unknown> = { ...filters };

  if (dateFrom || dateTo) {
    const dateFilter: Record<string, string> = {};
    if (dateFrom) dateFilter.$gte = dateFrom;
    if (dateTo) dateFilter.$lte = dateTo;
    mergedFilters[dateField] = dateFilter;
  }

  if (Object.keys(mergedFilters).length > 0) query.filters = mergedFilters;
  if (status) query.status = status;
  if (locale) query.locale = locale;

  return query;
}

/**
 * Resolve a potentially nested field path (e.g. "category.name") from a document.
 */
function resolveField(doc: Record<string, unknown>, fieldPath: string): unknown {
  const parts = fieldPath.split('.');
  let current: unknown = doc;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Paginate through all matching documents.
 * Uses populate: '*' to ensure relations are available for grouping.
 */
async function paginateAll(
  strapi: Core.Strapi,
  contentType: string,
  baseQuery: Record<string, unknown>,
): Promise<Record<string, unknown>[]> {
  const docs: Record<string, unknown>[] = [];
  let page = 1;

  while (docs.length < MAX_PAGINATE) {
    const results = await strapi.documents(contentType as any).findMany({
      ...baseQuery,
      populate: '*',
      page,
      pageSize: PAGE_SIZE,
    } as any);

    if (!results || results.length === 0) break;
    docs.push(...results);
    if (results.length < PAGE_SIZE) break;
    page++;
  }

  return docs;
}

/** Display-name candidates for relation objects (checked in order) */
const DISPLAY_CANDIDATES = ['name', 'title', 'username', 'label', 'slug', 'email'];

/**
 * Extract a human-readable string from a value that came out of resolveField.
 * Handles primitives, null, and relation objects that weren't fully dot-pathed.
 */
function toDisplayValue(raw: unknown): string {
  if (raw == null) return '(empty)';
  if (typeof raw !== 'object') return String(raw);

  // Array relation (e.g. manyToMany) — join display values
  if (Array.isArray(raw)) {
    if (raw.length === 0) return '(empty)';
    return raw.map((item) => toDisplayValue(item)).join(', ');
  }

  // Single relation object — pick best display field
  const obj = raw as Record<string, unknown>;
  for (const key of DISPLAY_CANDIDATES) {
    if (obj[key] != null) return String(obj[key]);
  }
  return obj.id != null ? String(obj.id) : '(empty)';
}

/**
 * Group documents by a resolved field path and return sorted counts.
 */
function groupDocs(
  docs: Record<string, unknown>[],
  fieldPath: string
): { value: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const doc of docs) {
    const raw = resolveField(doc, fieldPath);
    const value = toDisplayValue(raw);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

function getWeekKey(date: Date): string {
  // ISO week: find the Monday of the week
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

function getBucketKey(dateStr: string, granularity: 'day' | 'week' | 'month'): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'unknown';

  switch (granularity) {
    case 'day':
      return date.toISOString().slice(0, 10);
    case 'week':
      return getWeekKey(date);
    case 'month':
      return date.toISOString().slice(0, 7);
  }
}

export async function aggregateContent(
  strapi: Core.Strapi,
  params: AggregateContentParams
): Promise<AggregateContentResult> {
  const { contentType, operation } = params;

  if (!strapi.contentTypes[contentType as keyof typeof strapi.contentTypes]) {
    throw new Error(`Content type "${contentType}" does not exist.`);
  }

  const baseQuery = buildBaseQuery(params);

  switch (operation) {
    case 'count': {
      const total = await strapi.documents(contentType as any).count(baseQuery as any);
      return { total };
    }

    case 'countByField': {
      const { groupByField } = params;
      if (!groupByField) {
        throw new Error('groupByField is required for countByField operation');
      }

      // Auto-resolve relation fields using the runtime schema
      // e.g. "author" → "author.name", "category" → "category.name"
      const { resolvedPath } = resolveFieldPath(strapi, contentType, groupByField);

      const docs = await paginateAll(strapi, contentType, baseQuery);
      const groups = groupDocs(docs, resolvedPath);

      return { total: docs.length, groups, resolvedField: resolvedPath };
    }

    case 'countByDateRange': {
      const { dateField = 'createdAt', granularity = 'month' } = params;

      const docs = await paginateAll(strapi, contentType, baseQuery);
      const counts = new Map<string, number>();

      for (const doc of docs) {
        const raw = resolveField(doc, dateField);
        if (!raw) continue;
        const key = getBucketKey(String(raw), granularity);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      const buckets = Array.from(counts.entries())
        .map(([period, count]) => ({ period, count }))
        .sort((a, b) => a.period.localeCompare(b.period));

      return { total: docs.length, buckets };
    }

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}
