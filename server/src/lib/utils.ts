import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import type { UIMessage } from 'ai';
import { PassThrough } from 'node:stream';

/**
 * Get the AI SDK service with initialization check
 */
export function getService(strapi: Core.Strapi, ctx: Context) {
  const service = strapi.plugin('ai-sdk').service('service');

  if (!service.isInitialized()) {
    ctx.badRequest('AI SDK not initialized. Check plugin configuration.');
    return null;
  }

  return service;
}

/**
 * Validate request body for prompt-based requests
 */
export function validateBody(ctx: Context): { prompt: string; system?: string } | null {
  const { prompt, system } = ctx.request.body as { prompt?: string; system?: string };

  if (!prompt || typeof prompt !== 'string') {
    ctx.badRequest('prompt is required and must be a string');
    return null;
  }

  return { prompt, system };
}

/**
 * Validate request body for message-based chat requests
 */
export function validateChatBody(ctx: Context): { messages: UIMessage[]; system?: string } | null {
  const { messages, system } = ctx.request.body as { messages?: UIMessage[]; system?: string };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    ctx.badRequest('messages is required and must be a non-empty array');
    return null;
  }

  return { messages, system };
}

/**
 * Setup SSE stream with proper headers
 */
export function createSSEStream(ctx: Context): PassThrough {
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const stream = new PassThrough();
  ctx.body = stream;
  ctx.res.flushHeaders();

  return stream;
}

/**
 * Write SSE formatted data to stream
 */
export function writeSSE(stream: PassThrough, data: unknown): void {
  stream.write(`data: ${JSON.stringify(data)}\n\n`);
}
