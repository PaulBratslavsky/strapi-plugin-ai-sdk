/// <reference types="koa" />
declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Promise<void>;
    config: {
        default: {
            anthropicApiKey: string;
            chatModel: string;
            baseURL: any;
            systemPrompt: string;
        };
        validator(config: unknown): void;
    };
    controllers: {
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
    routes: {
        'content-api': {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: any[];
                };
            }[];
        };
        /**
         * Plugin server methods
         */
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: any[];
                };
            }[];
        };
    };
    services: {
        service: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            ask(prompt: string, options?: {
                system?: string;
            }): Promise<string>;
            askStream(prompt: string, options?: {
                system?: string;
            }): Promise<AsyncIterable<string>>;
            chat(messages: import("ai").UIMessage<unknown, import("ai").UIDataTypes, import("ai").UITools>[], options?: {
                system?: string;
            }): Promise<import("./lib/init-ai-sdk").StreamTextRawResult>;
            isInitialized(): boolean;
        };
    };
    contentTypes: {};
    policies: {};
    middlewares: {};
};
export default _default;
