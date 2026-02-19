import type { Core } from '@strapi/strapi';
export declare const searchContentTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            contentType: {
                type: string;
                description: string;
            };
            query: {
                type: string;
                description: string;
            };
            filters: {
                type: string;
                description: string;
            };
            fields: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            sort: {
                type: string;
                description: string;
            };
            page: {
                type: string;
                description: string;
                default: number;
            };
            pageSize: {
                type: string;
                description: string;
                default: number;
            };
        };
        required: string[];
    };
};
export declare function handleSearchContent(strapi: Core.Strapi, args: unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
