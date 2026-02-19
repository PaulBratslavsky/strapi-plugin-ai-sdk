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
/**
 * Core logic for listing content types and components.
 * Shared between AI SDK tool and MCP tool.
 */
export declare function listContentTypes(strapi: Core.Strapi): Promise<ListContentTypesResult>;
