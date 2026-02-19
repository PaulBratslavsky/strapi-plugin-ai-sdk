import type { Core } from '@strapi/strapi';
export declare function createTools(strapi: Core.Strapi): {
    listContentTypes: import("ai").Tool<Record<string, never>, import("../tool-logic").ListContentTypesResult>;
    searchContent: import("ai").Tool<{
        contentType: string;
        page: number;
        pageSize: number;
        query?: string;
        filters?: Record<string, unknown>;
        fields?: string[];
        sort?: string;
    }, import("../tool-logic").SearchContentResult>;
    writeContent: import("ai").Tool<{
        contentType: string;
        action: "create" | "update";
        data: Record<string, unknown>;
        documentId?: string;
        status?: "draft" | "published";
    }, {
        document: any;
        action: "create" | "update";
    }>;
    triggerAnimation: import("ai").Tool<{
        animation: "idle" | "speak" | "wave" | "nod" | "think" | "celebrate" | "shake" | "spin";
    }, {
        triggered: "idle" | "speak" | "wave" | "nod" | "think" | "celebrate" | "shake" | "spin";
        status: string;
    }>;
};
/**
 * Build a system prompt section describing all available tools.
 * Reads the `description` from each tool definition so it stays in sync automatically.
 */
export declare function describeTools(tools: Record<string, {
    description?: string;
}>): string;
