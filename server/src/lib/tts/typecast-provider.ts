import type { TTSProvider, TTSOptions } from './types';

const MAX_CHARS = 2000;

/**
 * Split text into chunks of at most `maxLen` characters,
 * preferring sentence boundaries (. ! ? followed by space or end).
 */
function chunkText(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    // Find the last sentence-ending punctuation within the limit
    const slice = remaining.slice(0, maxLen);
    const match = slice.match(/.*[.!?](\s|$)/);
    const splitAt = match ? match[0].length : maxLen;

    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
}

export class TypecastProvider implements TTSProvider {
  private apiKey: string;
  private actorId: string;

  constructor(apiKey: string, actorId: string) {
    this.apiKey = apiKey;
    this.actorId = actorId;
  }

  async synthesize(text: string, options?: TTSOptions): Promise<Buffer> {
    const chunks = chunkText(text, MAX_CHARS);
    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      const buf = await this.synthesizeChunk(chunk, options);
      buffers.push(buf);
    }

    return Buffer.concat(buffers);
  }

  private async synthesizeChunk(text: string, options?: TTSOptions): Promise<Buffer> {
    const body: Record<string, unknown> = {
      text,
      voice_id: this.actorId,
      model: 'ssfm-v30',
      lang: 'auto',
    };

    if (options?.emotion) {
      body.emotion = options.emotion;
    }

    if (options?.speed !== undefined) {
      body.speed = options.speed;
    }

    const response = await fetch('https://api.typecast.ai/v1/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Typecast API error ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
