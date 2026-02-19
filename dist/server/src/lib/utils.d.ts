/// <reference types="node" />
import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
import type { UIMessage } from 'ai';
import { PassThrough } from 'node:stream';
/**
 * Get the AI SDK service with initialization check
 */
export declare function getService(strapi: Core.Strapi, ctx: Context): Core.Service;
/**
 * Validate request body for prompt-based requests
 */
export declare function validateBody(ctx: Context): {
    prompt: string;
    system?: string;
} | null;
/**
 * Validate request body for message-based chat requests
 */
export declare function validateChatBody(ctx: Context): {
    messages: UIMessage[];
    system?: string;
} | null;
/**
 * Setup SSE stream with proper headers
 */
export declare function createSSEStream(ctx: Context): PassThrough;
/**
 * Write SSE formatted data to stream
 */
export declare function writeSSE(stream: PassThrough, data: unknown): void;
