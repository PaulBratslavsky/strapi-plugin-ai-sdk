import { z } from 'zod';

// Schema for list_content_types tool (no parameters needed)
export const ListContentTypesSchema = z.object({});

// Schema for search_content tool
export const SearchContentSchema = z.object({
  contentType: z.string().min(1, 'Content type UID is required'),
  query: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
  fields: z.array(z.string()).optional(),
  sort: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(50).optional().default(10),
});

// Schema for write_content tool
export const WriteContentSchema = z.object({
  contentType: z.string().min(1, 'Content type UID is required'),
  action: z.enum(['create', 'update']),
  documentId: z.string().optional(),
  data: z.record(z.string(), z.any()),
  status: z.enum(['draft', 'published']).optional(),
});

// Type exports
export type ListContentTypesInput = z.infer<typeof ListContentTypesSchema>;
export type SearchContentInput = z.infer<typeof SearchContentSchema>;
export type WriteContentInput = z.infer<typeof WriteContentSchema>;

// All schemas for easy lookup
export const ToolSchemas = {
  list_content_types: ListContentTypesSchema,
  search_content: SearchContentSchema,
  write_content: WriteContentSchema,
} as const;

type ToolName = keyof typeof ToolSchemas;

// Validation helper function
export function validateToolInput<T extends ToolName>(
  toolName: T,
  input: unknown
): z.infer<(typeof ToolSchemas)[T]> {
  const schema = ToolSchemas[toolName];
  const result = schema.safeParse(input);

  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });
    throw new Error(`Validation failed for ${toolName}:\n${errorMessages.join('\n')}`);
  }

  return result.data as z.infer<(typeof ToolSchemas)[T]>;
}
