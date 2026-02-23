export default {
  default: {
    anthropicApiKey: '',
    chatModel: 'claude-sonnet-4-20250514',
    baseURL: undefined,
    systemPrompt: '',
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
