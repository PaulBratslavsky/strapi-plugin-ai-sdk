import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import { Readable } from 'node:stream';
import { getService, validateBody, validateChatBody, createSSEStream, writeSSE } from '../lib/utils';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async ask(ctx: Context) {
    const body = validateBody(ctx);
    if (!body) return;

    const service = getService(strapi, ctx);
    if (!service) return;

    const result = await service.ask(body.prompt, { system: body.system });
    ctx.body = { data: { text: result } };
  },

  async askStream(ctx: Context) {
    const body = validateBody(ctx);
    if (!body) return;

    const service = getService(strapi, ctx);
    if (!service) return;

    const textStream = await service.askStream(body.prompt, { system: body.system });
    const stream = createSSEStream(ctx);

    void (async () => {
      try {
        for await (const chunk of textStream) {
          writeSSE(stream, { text: chunk });
        }
        stream.write('data: [DONE]\n\n');
      } catch (error) {
        strapi.log.error('AI SDK stream error:', error);
        writeSSE(stream, { error: 'Stream error' });
      } finally {
        stream.end();
      }
    })();
  },

  /**
   * Chat endpoint using AI SDK UI message stream protocol
   * Compatible with useChat hook from @ai-sdk/react
   */
  async chat(ctx: Context) {
    const body = validateChatBody(ctx);
    if (!body) return;

    const service = getService(strapi, ctx);
    if (!service) return;

    const config = strapi.config.get('plugin::ai-sdk') as { systemPrompt?: string };
    const system = body.system || config.systemPrompt || undefined;

    const result = await service.chat(body.messages, { system });

    // Get the response using toUIMessageStreamResponse
    const response = result.toUIMessageStreamResponse();

    // Set headers for streaming
    ctx.status = 200;
    ctx.set('Content-Type', 'text/event-stream; charset=utf-8');
    ctx.set('Cache-Control', 'no-cache, no-transform');
    ctx.set('Connection', 'keep-alive');
    ctx.set('X-Accel-Buffering', 'no');
    ctx.set('x-vercel-ai-ui-message-stream', 'v1');

    // Convert Web ReadableStream to Node.js Readable stream for Koa
    ctx.body = Readable.fromWeb(response.body as import('stream/web').ReadableStream);
  },
});

export default controller;
