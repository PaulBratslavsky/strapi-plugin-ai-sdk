import type { Core } from '@strapi/strapi';
export declare const listContentTypesTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: string[];
    };
};
export declare function handleListContentTypes(strapi: Core.Strapi, args: unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
