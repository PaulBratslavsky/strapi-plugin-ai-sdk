/// <reference types="koa" />
declare const _default: {
    controller: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        ask(ctx: import("koa").Context): Promise<void>;
        askStream(ctx: import("koa").Context): Promise<void>;
        chat(ctx: import("koa").Context): Promise<void>;
    };
    mcp: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        handle(ctx: any): Promise<void>;
    };
};
export default _default;
