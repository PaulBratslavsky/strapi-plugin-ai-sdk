import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
declare const controller: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    ask(ctx: Context): Promise<void>;
    askStream(ctx: Context): Promise<void>;
    /**
     * Chat endpoint using AI SDK UI message stream protocol
     * Compatible with useChat hook from @ai-sdk/react
     */
    chat(ctx: Context): Promise<void>;
};
export default controller;
