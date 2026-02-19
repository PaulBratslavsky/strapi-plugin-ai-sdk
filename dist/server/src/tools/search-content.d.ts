import type { Core } from '@strapi/strapi';
export declare function createSearchContentTool(strapi: Core.Strapi): import("ai").Tool<{
    contentType: string;
    page: number;
    pageSize: number;
    query?: string;
    filters?: Record<string, unknown>;
    fields?: string[];
    sort?: string;
}, import("../tool-logic").SearchContentResult>;
