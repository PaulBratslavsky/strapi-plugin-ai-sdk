import { uploadMedia, uploadMediaSchema, uploadMediaDescription } from '../../tool-logic';
import type { ToolDefinition } from '../../lib/tool-registry';

export const uploadMediaTool: ToolDefinition = {
  name: 'uploadMedia',
  description: uploadMediaDescription,
  schema: uploadMediaSchema,
  execute: async (args, strapi) => uploadMedia(strapi, args),
};
