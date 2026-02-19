import { z } from 'zod';
export declare const ListContentTypesSchema: z.ZodObject<{}, z.core.$strip>;
export declare const SearchContentSchema: z.ZodObject<{
    contentType: z.ZodString;
    query: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
    sort: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export declare const WriteContentSchema: z.ZodObject<{
    contentType: z.ZodString;
    action: z.ZodEnum<{
        create: "create";
        update: "update";
    }>;
    documentId: z.ZodOptional<z.ZodString>;
    data: z.ZodRecord<z.ZodString, z.ZodAny>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
    }>>;
}, z.core.$strip>;
export type ListContentTypesInput = z.infer<typeof ListContentTypesSchema>;
export type SearchContentInput = z.infer<typeof SearchContentSchema>;
export type WriteContentInput = z.infer<typeof WriteContentSchema>;
export declare const ToolSchemas: {
    readonly list_content_types: z.ZodObject<{}, z.core.$strip>;
    readonly search_content: z.ZodObject<{
        contentType: z.ZodString;
        query: z.ZodOptional<z.ZodString>;
        filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        fields: z.ZodOptional<z.ZodArray<z.ZodString>>;
        sort: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        pageSize: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
    readonly write_content: z.ZodObject<{
        contentType: z.ZodString;
        action: z.ZodEnum<{
            create: "create";
            update: "update";
        }>;
        documentId: z.ZodOptional<z.ZodString>;
        data: z.ZodRecord<z.ZodString, z.ZodAny>;
        status: z.ZodOptional<z.ZodEnum<{
            draft: "draft";
            published: "published";
        }>>;
    }, z.core.$strip>;
};
type ToolName = keyof typeof ToolSchemas;
export declare function validateToolInput<T extends ToolName>(toolName: T, input: unknown): z.infer<(typeof ToolSchemas)[T]>;
export {};
