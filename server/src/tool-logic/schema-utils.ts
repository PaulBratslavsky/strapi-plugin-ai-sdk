import type { Core } from '@strapi/strapi';

/** Common display-name field candidates, checked in priority order. */
const DISPLAY_CANDIDATES = ['name', 'title', 'username', 'label', 'slug', 'email'];

interface AttributeDef {
  type: string;
  target?: string;
  relation?: string;
  component?: string;
  components?: string[];
  [key: string]: unknown;
}

interface ContentTypeSchema {
  attributes?: Record<string, AttributeDef>;
  info?: { displayName?: string };
}

/**
 * Look up the schema for a content type UID.
 */
export function getSchema(strapi: Core.Strapi, contentType: string): ContentTypeSchema | undefined {
  return (strapi.contentTypes as unknown as Record<string, ContentTypeSchema>)[contentType];
}

/**
 * Get the attribute definition for a top-level field on a content type.
 */
export function getAttribute(
  strapi: Core.Strapi,
  contentType: string,
  field: string
): AttributeDef | undefined {
  const schema = getSchema(strapi, contentType);
  return schema?.attributes?.[field];
}

/**
 * Check if a field is a relation on the given content type.
 */
export function isRelation(strapi: Core.Strapi, contentType: string, field: string): boolean {
  const attr = getAttribute(strapi, contentType, field);
  return attr?.type === 'relation';
}

/**
 * For a relation field, get the target content type UID.
 */
export function getRelationTarget(
  strapi: Core.Strapi,
  contentType: string,
  field: string
): string | undefined {
  const attr = getAttribute(strapi, contentType, field);
  if (attr?.type === 'relation') return attr.target;
  return undefined;
}

/**
 * Determine the best human-readable display field for a content type.
 * Checks common candidates (name, title, username, label, slug, email),
 * then falls back to the first string/text field, then 'id'.
 */
export function getDisplayField(strapi: Core.Strapi, contentType: string): string {
  const schema = getSchema(strapi, contentType);
  if (!schema?.attributes) return 'id';

  // Check priority candidates
  for (const candidate of DISPLAY_CANDIDATES) {
    const attr = schema.attributes[candidate];
    if (attr && (attr.type === 'string' || attr.type === 'text' || attr.type === 'email')) {
      return candidate;
    }
  }

  // Fallback: first string field
  for (const [name, attr] of Object.entries(schema.attributes)) {
    if (attr.type === 'string' || attr.type === 'text') {
      return name;
    }
  }

  return 'id';
}

/**
 * Given a field path that the AI provided (e.g. "author", "category", "author.name"),
 * resolve it to the actual dot-path needed to extract a display value from a populated document.
 *
 * If the field is a relation with no sub-field specified, appends the best display field
 * from the target schema (e.g. "author" → "author.name").
 *
 * Returns the resolved path and any top-level relations that need populating.
 */
/** Relation kinds where the field value is an array of related items */
const MANY_RELATIONS = new Set(['oneToMany', 'manyToMany']);

export interface ResolvedField {
  /** The dot-path to extract the display value (e.g. "author.name") */
  resolvedPath: string;
  /** Top-level relations that must be populated */
  populate: string[];
  /** True if the relation is a *ToMany (value is an array of items) */
  isArray: boolean;
  /** The sub-field to select from the relation (for targeted populate) */
  selectField?: string;
}

export function resolveFieldPath(
  strapi: Core.Strapi,
  contentType: string,
  fieldPath: string
): ResolvedField {
  const parts = fieldPath.split('.');
  const topField = parts[0];
  const attr = getAttribute(strapi, contentType, topField);

  if (!attr) {
    // Unknown field — pass through as-is
    return { resolvedPath: fieldPath, populate: [], isArray: false };
  }

  if (attr.type === 'relation' && attr.target) {
    const isArray = MANY_RELATIONS.has(attr.relation ?? '');

    if (parts.length === 1) {
      // Bare relation field — auto-append display field from target schema
      const displayField = getDisplayField(strapi, attr.target);
      return {
        resolvedPath: `${topField}.${displayField}`,
        populate: [topField],
        isArray,
        selectField: displayField,
      };
    }
    // Already has a sub-path (e.g. "author.email") — just ensure it's populated
    return {
      resolvedPath: fieldPath,
      populate: [topField],
      isArray,
      selectField: parts.slice(1).join('.'),
    };
  }

  // Scalar field — no populate needed
  return { resolvedPath: fieldPath, populate: [], isArray: false };
}
