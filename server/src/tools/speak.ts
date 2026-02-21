import { tool, zodSchema } from 'ai';
import { z } from 'zod';
import type { TTSProvider } from '../lib/tts/types';
import { speakText } from '../tool-logic/speak';

export function createSpeakTool(ttsProvider: TTSProvider) {
  return tool({
    description: [
      'Speak text aloud using text-to-speech. Call this tool to vocalize a short summary of your response.',
      'IMPORTANT: Do NOT pass the full response text — instead pass a concise spoken version (1-2 sentences).',
      'This makes the avatar character speak the text audibly to the user.',
    ].join('\n'),
    inputSchema: zodSchema(
      z.object({
        text: z.string().describe('A short spoken summary of your response (1-2 sentences, max 200 chars)'),
        emotion: z
          .enum(['happy', 'sad', 'angry', 'surprise', 'neutral'])
          .optional()
          .describe('Emotion tone for the speech'),
      })
    ),
    execute: async ({ text, emotion }) => {
      try {
        return await speakText(ttsProvider, { text, emotion });
      } catch (error) {
        console.error('[ai-sdk] speak tool error:', error);
        return { error: String(error) };
      }
    },
  });
}
