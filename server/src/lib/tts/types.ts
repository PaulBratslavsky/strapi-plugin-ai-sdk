export interface TTSProvider {
  synthesize(text: string, options?: TTSOptions): Promise<Buffer>;
}

export interface TTSOptions {
  emotion?: string;
  speed?: number;
}
