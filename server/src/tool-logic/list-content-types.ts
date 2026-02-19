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

const INTERNAL_FIELDS = [
  'createdAt',
  'updatedAt',
  'publishedAt',
  'createdBy',
  'updatedBy',
  'locale',
  'localizations',
];

/**
 * Core logic for listing content types and components.
 * Shared between AI SDK tool and MCP tool.
 */
export async function listContentTypes(strapi: Core.Strapi): Promise<ListContentTypesResult> {
  const contentTypes = strapi.contentTypes;
  const components = strapi.components;

  const apiContentTypes: ContentTypeSummary[] = [];

  for (const [uid, contentType] of Object.entries(contentTypes)) {
    if (uid.startsWith('admin::') || uid.startsWith('strapi::')) continue;

    const ct = contentType as any;
    const kind = ct.kind || 'collectionType';
    const fields: string[] = [];
    const relations: RelationSummary[] = [];
    const usedComponents: string[] = [];

    for (const [attrName, attrDef] of Object.entries(ct.attributes || {})) {
      if (INTERNAL_FIELDS.includes(attrName)) continue;

      const attr = attrDef as any;
      fields.push(attrName);

      if (attr.type === 'relation' && attr.target) {
        const targetCt = contentTypes[attr.target as keyof typeof contentTypes] as any;
        relations.push({
          field: attrName,
          type: attr.relation,
          target: attr.target,
          targetDisplayName: targetCt?.info?.displayName || attr.target,
        });
      }

      if (attr.type === 'component' && attr.component) {
        if (!usedComponents.includes(attr.component)) {
          usedComponents.push(attr.component);
        }
      }

      if (attr.type === 'dynamiczone') {
        for (const comp of attr.components || []) {
          if (!usedComponents.includes(comp)) {
            usedComponents.push(comp);
          }
        }
      }
    }

    apiContentTypes.push({
      uid,
      kind: kind as 'collectionType' | 'singleType',
      displayName: ct.info?.displayName || uid,
      fields,
      relations,
      components: usedComponents,
    });
  }

  apiContentTypes.sort((a, b) => a.displayName.localeCompare(b.displayName));

  const componentSummaries: ComponentSummary[] = [];
  for (const [uid, component] of Object.entries(components)) {
    const comp = component as any;
    componentSummaries.push({
      uid,
      category: comp.category || 'default',
      displayName: comp.info?.displayName || uid,
      fieldCount: Object.keys(comp.attributes || {}).length,
    });
  }

  componentSummaries.sort((a, b) => {
    const cat = a.category.localeCompare(b.category);
    return cat !== 0 ? cat : a.displayName.localeCompare(b.displayName);
  });

  return {
    contentTypes: apiContentTypes,
    components: componentSummaries,
  };
}
