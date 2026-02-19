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
export declare function writeContent(strapi: Core.Strapi, params: WriteContentParams): Promise<WriteContentResult>;
