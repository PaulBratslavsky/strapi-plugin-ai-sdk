import type { TTSProvider } from './types';
import { TypecastProvider } from './typecast-provider';

export type { TTSProvider, TTSOptions } from './types';

type TTSFactory = (config: Record<string, unknown>) => TTSProvider;

export class TTSRegistry {
  private factories = new Map<string, TTSFactory>();

  register(name: string, factory: TTSFactory): void {
    this.factories.set(name, factory);
  }

  create(name: string, config: Record<string, unknown>): TTSProvider {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Unknown TTS provider: "${name}". Registered: ${[...this.factories.keys()].join(', ') || 'none'}`);
    }
    return factory(config);
  }

  has(name: string): boolean {
    return this.factories.has(name);
  }
}

/**
 * Create a TTSRegistry with built-in providers pre-registered.
 */
export function createTTSRegistry(): TTSRegistry {
  const registry = new TTSRegistry();

  registry.register('typecast', (config) => {
    const apiKey = config.apiKey as string;
    const actorId = config.actorId as string;
    if (!apiKey || !actorId) {
      throw new Error('Typecast TTS requires apiKey and actorId');
    }
    return new TypecastProvider(apiKey, actorId);
  });

  return registry;
}

// Backward-compatible helper — delegates to a default registry
interface TTSConfig extends Record<string, unknown> {
  provider: string;
  apiKey: string;
  actorId: string;
}

export function createTTSProvider(config: TTSConfig): TTSProvider {
  const registry = createTTSRegistry();
  return registry.create(config.provider, config);
}
