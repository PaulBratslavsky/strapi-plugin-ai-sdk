import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { writeFileSync, unlinkSync, mkdtempSync, rmdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export const uploadMediaSchema = z.object({
  url: z.string().describe('URL of the file to upload'),
  name: z.string().optional().describe('Custom filename (optional, defaults to filename from URL)'),
  caption: z.string().optional().describe('Caption for the media file'),
  alternativeText: z
    .string()
    .optional()
    .describe('Alternative text for accessibility'),
});

export const uploadMediaDescription =
  'Upload a media file from a URL to the Strapi media library. Returns the uploaded file data. To link media to a content type field, use writeContent with the file ID.';

export interface UploadMediaParams {
  url: string;
  name?: string;
  caption?: string;
  alternativeText?: string;
}

export interface UploadMediaResult {
  file: any;
  message: string;
  usage: string;
}

/**
 * Core logic for uploading media from a URL.
 * Shared between AI SDK tool and MCP tool.
 */
export async function uploadMedia(
  strapi: Core.Strapi,
  params: UploadMediaParams
): Promise<UploadMediaResult> {
  const { url, name, caption, alternativeText } = params;

  // Validate URL to prevent SSRF attacks
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Invalid URL provided');
  }

  // Only allow http and https protocols
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('Only HTTP and HTTPS protocols are allowed');
  }

  // Block private IP ranges and localhost to prevent SSRF
  const hostname = parsedUrl.hostname.toLowerCase();
  const isPrivateOrLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
    hostname === '::1' ||
    hostname.startsWith('::ffff:127.') ||
    hostname === '169.254.169.254'; // AWS metadata service

  if (isPrivateOrLocal) {
    throw new Error('Cannot fetch from private or local network addresses');
  }

  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(30000) // 30 second timeout
  });

  // Handle redirects manually to prevent SSRF bypass
  if (response.status >= 300 && response.status < 400) {
    throw new Error('Redirects are not allowed for security reasons');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from URL (no redirects allowed) or use provided name
  const urlPath = parsedUrl.pathname;
  const urlFilename = urlPath.split('/').pop() || 'upload';
  const filename = name || urlFilename;

  // Write buffer to a temp file — Strapi's upload service requires a real file path
  const tmpDir = mkdtempSync(join(tmpdir(), 'strapi-upload-'));
  const tmpPath = join(tmpDir, filename);
  writeFileSync(tmpPath, buffer);

  // Match Formidable's file shape expected by Strapi's upload service
  const fileData = {
    filepath: tmpPath,
    originalFilename: filename,
    mimetype: contentType,
    size: buffer.length,
  };

  const fileInfo: Record<string, string> = {};
  if (caption) fileInfo.caption = caption;
  if (alternativeText) fileInfo.alternativeText = alternativeText;

  let uploadedFile: any;
  try {
    [uploadedFile] = await strapi.plugins.upload.services.upload.upload({
      data: { fileInfo },
      files: fileData,
    });
  } finally {
    // Clean up temp file and directory independently to prevent leaks
    try {
      unlinkSync(tmpPath);
    } catch { /* ignore if file doesn't exist */ }
    try {
      rmdirSync(tmpDir);
    } catch { /* ignore if directory doesn't exist */ }
  }

  if (!uploadedFile) {
    throw new Error('Upload failed: no file returned from upload service');
  }

  return {
    file: uploadedFile,
    message: `File "${uploadedFile.name}" uploaded successfully (ID: ${uploadedFile.id}).`,
    usage: `To link this file to a content type field, use writeContent with: { "fieldName": ${uploadedFile.id} }`,
  };
}
