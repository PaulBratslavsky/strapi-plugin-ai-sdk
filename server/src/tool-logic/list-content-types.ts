import type { Core } from '@strapi/strapi';

export interface RelationSummary {
  field: string;
  type: string;
  target: string;
  targetDisplayName: string;
}

export interface ContentTypeSummary {
  uid: string;
  kind: 'collectionType' | 'singleType';
  displayName: string;
  fields: string[];
  relations: RelationSummary[];
  components: string[];
}

export interface ComponentSummary {
  uid: string;
  category: string;
  displayName: string;
  fieldCount: number;
}

export interface ListContentTypesResult {
  contentTypes: ContentTypeSummary[];
  components: ComponentSummary[];
}

interface StrapiContentType {
  kind?: string;
  info?: { displayName?: string };
  attributes?: Record<string, Record<string, unknown>>;
}

interface StrapiComponent {
  category?: string;
  info?: { displayName?: string };
  attributes?: Record<string, unknown>;
}

const INTERNAL_FIELDS = new Set([
  'createdAt',
  'updatedAt',
  'publishedAt',
  'createdBy',
  'updatedBy',
  'locale',
  'localizations',
]);

function isApiContentType(uid: string): boolean {
  return !uid.startsWith('admin::') && !uid.startsWith('strapi::');
}

function extractRelation(
  attrName: string,
  attr: Record<string, unknown>,
  contentTypes: object
): RelationSummary | null {
  if (attr.type !== 'relation' || !attr.target) return null;

  const target = attr.target as string;
  const relation = attr.relation as string;
  const targetCt = (contentTypes as Record<string, StrapiContentType>)[target];
  return {
    field: attrName,
    type: relation,
    target,
    targetDisplayName: targetCt?.info?.displayName || target,
  };
}

function collectComponents(attr: Record<string, unknown>): string[] {
  if (attr.type === 'component' && attr.component) {
    return [attr.component as string];
  }
  if (attr.type === 'dynamiczone' && Array.isArray(attr.components)) {
    return attr.components as string[];
  }
  return [];
}

function parseContentType(
  uid: string,
  contentType: unknown,
  allContentTypes: object
): ContentTypeSummary {
  const ct = contentType as StrapiContentType;
  const fields: string[] = [];
  const relations: RelationSummary[] = [];
  const usedComponents = new Set<string>();

  for (const [attrName, attrDef] of Object.entries(ct.attributes || {})) {
    if (INTERNAL_FIELDS.has(attrName)) continue;

    fields.push(attrName);

    const relation = extractRelation(attrName, attrDef, allContentTypes);
    if (relation) relations.push(relation);

    for (const comp of collectComponents(attrDef)) {
      usedComponents.add(comp);
    }
  }

  return {
    uid,
    kind: (ct.kind || 'collectionType') as 'collectionType' | 'singleType',
    displayName: ct.info?.displayName || uid,
    fields,
    relations,
    components: [...usedComponents],
  };
}

function parseComponent(uid: string, component: unknown): ComponentSummary {
  const comp = component as StrapiComponent;
  return {
    uid,
    category: comp.category || 'default',
    displayName: comp.info?.displayName || uid,
    fieldCount: Object.keys(comp.attributes || {}).length,
  };
}

/**
 * Core logic for listing content types and components.
 * Shared between AI SDK tool and MCP tool.
 */
export async function listContentTypes(strapi: Core.Strapi): Promise<ListContentTypesResult> {
  const contentTypes = Object.entries(strapi.contentTypes)
    .filter(([uid]) => isApiContentType(uid))
    .map(([uid, ct]) => parseContentType(uid, ct, strapi.contentTypes))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const components = Object.entries(strapi.components)
    .map(([uid, comp]) => parseComponent(uid, comp))
    .sort((a, b) => a.category.localeCompare(b.category) || a.displayName.localeCompare(b.displayName));

  return { contentTypes, components };
}
