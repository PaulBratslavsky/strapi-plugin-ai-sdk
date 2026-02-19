import type { Core } from '@strapi/strapi';
export declare const tools: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: string[];
    };
}[];
/**
 * Handle a tool call by delegating to the appropriate handler
 */
export declare function handleToolCall(strapi: Core.Strapi, request: {
    params: {
        name: string;
        arguments?: Record<string, unknown>;
    };
}): Promise<any>;
