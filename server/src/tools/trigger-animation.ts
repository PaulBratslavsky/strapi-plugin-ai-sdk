import { tool, zodSchema } from 'ai';
import { z } from 'zod';

export function createTriggerAnimationTool() {
  return tool({
    description: [
      'Trigger a 3D avatar animation on the client. ALWAYS call this at the start of every response.',
      'Available animations and when to use them:',
      '- speak: DEFAULT — use this for all normal responses (head nods, arm gestures, like talking)',
      '- wave: greeting the user or saying hello/goodbye',
      '- nod: agreeing, confirming, or acknowledging something',
      '- think: considering a question, pondering, or working through a problem',
      '- celebrate: task completed successfully, good news, or congratulations',
      '- shake: disagreeing, saying no, or indicating something is wrong',
      '- spin: when the user asks you to spin or do a twirl',
      '- idle: return to default resting pose',
      'When in doubt, use "speak". Use specific animations only for strong emotional moments.',
    ].join('\n'),
    inputSchema: zodSchema(
      z.object({
        animation: z
          .enum(['idle', 'speak', 'wave', 'nod', 'think', 'celebrate', 'shake', 'spin'])
          .describe('The animation to play on the 3D avatar'),
      })
    ),
    execute: async ({ animation }) => {
      return { triggered: animation, status: 'playing' };
    },
  });
}
