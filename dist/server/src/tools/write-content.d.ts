import type { Core } from '@strapi/strapi';
export declare function createWriteContentTool(strapi: Core.Strapi): import("ai").Tool<{
    contentType: string;
    action: "create" | "update";
    data: Record<string, unknown>;
    documentId?: string;
    status?: "draft" | "published";
}, import("../tool-logic").WriteContentResult>;
