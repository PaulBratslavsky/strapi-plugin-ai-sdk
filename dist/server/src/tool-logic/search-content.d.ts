import type { Core } from '@strapi/strapi';
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
export declare function searchContent(strapi: Core.Strapi, params: SearchContentParams): Promise<SearchContentResult>;
