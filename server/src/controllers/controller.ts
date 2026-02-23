import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import { Readable } from 'node:stream';
import { getService, validateBody, validateChatBody, createSSEStream, writeSSE } from '../lib/utils';
import type { TTSProvider } from '../lib/tts/types';

const PLUGIN_ID = 'ai-sdk';

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

    (async () => {
      try {
        for await (const chunk of textStream) {
          writeSSE(stream, { text: chunk });
        }
        stream.write('data: [DONE]\n\n');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          strapi.log.debug('AI SDK stream aborted by client');
        } else {
          strapi.log.error('AI SDK stream error:', error);
        }
        const errorMessage = error instanceof Error ? error.message : 'Stream error occurred';
        writeSSE(stream, { error: errorMessage });
      } finally {
        stream.end();
      }
    })().catch((error) => {
      strapi.log.error('Uncaught stream error:', error);
      stream.end();
    });
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

    const result = await service.chat(body.messages, { system: body.system });

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

  async tts(ctx: Context) {
    const { text } = ctx.request.body as { text?: string };
    if (!text || typeof text !== 'string') {
      ctx.status = 400;
      ctx.body = { error: 'Missing "text" field' };
      return;
    }

    const plugin = strapi.plugin(PLUGIN_ID) as unknown as { ttsProvider?: TTSProvider };
    if (!plugin.ttsProvider) {
      ctx.status = 501;
      ctx.body = { error: 'TTS not configured' };
      return;
    }

    try {
      const buffer = await plugin.ttsProvider.synthesize(text);
      ctx.status = 200;
      ctx.set('Content-Type', 'audio/wav');
      ctx.body = buffer;
    } catch (error) {
      strapi.log.error('[ai-sdk] TTS error:', error);
      ctx.status = 502;
      ctx.body = { error: 'TTS synthesis failed' };
    }
  },
});

export default controller;
