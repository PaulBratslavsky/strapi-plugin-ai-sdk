import type { Core } from '@strapi/strapi';
export declare const writeContentTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            contentType: {
                type: string;
                description: string;
            };
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            documentId: {
                type: string;
                description: string;
            };
            data: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleWriteContent(strapi: Core.Strapi, args: unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
