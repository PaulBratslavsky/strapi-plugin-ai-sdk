import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { writeFileSync, unlinkSync, mkdtempSync } from 'fs';
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

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) {
    throw new Error(`Failed to fetch file from URL: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Extract filename from the final URL (after redirects) or use provided name
  const finalUrl = response.url || url;
  const urlPath = new URL(finalUrl).pathname;
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
    try { unlinkSync(tmpPath); } catch { /* ignore cleanup errors */ }
  }

  return {
    file: uploadedFile,
    message: `File "${uploadedFile.name}" uploaded successfully (ID: ${uploadedFile.id}).`,
    usage: `To link this file to a content type field, use writeContent with: { "fieldName": ${uploadedFile.id} }`,
  };
}
