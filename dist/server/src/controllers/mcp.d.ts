import type { Core } from '@strapi/strapi';
declare const mcpController: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Handle MCP requests (POST, GET, DELETE).
     * Creates a new server+transport per session for proper isolation.
     */
    handle(ctx: any): Promise<void>;
};
export default mcpController;
