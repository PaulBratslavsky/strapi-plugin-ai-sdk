import type { Context } from 'koa';

export interface GuardrailInput {
  text: string;
  route: string;
  ctx: Context;
}

export interface GuardrailResult {
  blocked: boolean;
  reason?: string;
  sanitized?: string;
}

export interface GuardrailConfig {
  enabled?: boolean;
  maxInputLength?: number;
  additionalPatterns?: string[];
  disableDefaultPatterns?: boolean;
  blockedMessage?: string;
  beforeProcess?: (input: GuardrailInput) => Promise<GuardrailResult>;
}
