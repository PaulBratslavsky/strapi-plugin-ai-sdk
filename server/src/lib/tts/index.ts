import type { TTSProvider } from './types';
import { TypecastProvider } from './typecast-provider';

export type { TTSProvider, TTSOptions } from './types';

interface TTSConfig {
  provider: 'typecast';
  apiKey: string;
  actorId: string;
}

export function createTTSProvider(config: TTSConfig): TTSProvider {
  switch (config.provider) {
    case 'typecast':
      return new TypecastProvider(config.apiKey, config.actorId);
    default:
      throw new Error(`Unknown TTS provider: ${config.provider}`);
  }
}
