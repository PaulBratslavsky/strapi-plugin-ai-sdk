export default {
  default: {
    anthropicApiKey: '',
    provider: 'anthropic',
    chatModel: 'claude-sonnet-4-20250514',
    baseURL: undefined,
    systemPrompt: '',
    mcp: {
      sessionTimeoutMs: 4 * 60 * 60 * 1000,
      maxSessions: 100,
      cleanupInterval: 100,
    },
    guardrails: {
      enabled: true,
      maxInputLength: 10000,
    },
  },
  validator(config: unknown) {
    if (typeof config !== 'object' || config === null) {
      throw new Error('Config must be an object');
    }
    const c = config as Record<string, unknown>;
    if (c.anthropicApiKey && typeof c.anthropicApiKey !== 'string') {
      throw new Error('anthropicApiKey must be a string');
    }
    if (c.chatModel && typeof c.chatModel !== 'string') {
      throw new Error('chatModel must be a string');
    }
  },
};
