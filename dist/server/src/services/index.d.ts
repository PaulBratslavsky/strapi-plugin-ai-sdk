declare const _default: {
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
        }): Promise<import("../lib/init-ai-sdk").StreamTextRawResult>;
        isInitialized(): boolean;
    };
};
export default _default;
