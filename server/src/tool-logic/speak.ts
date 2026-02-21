import type { TTSProvider } from '../lib/tts/types';

export interface SpeakParams {
  text: string;
  emotion?: string;
}

export async function speakText(
  ttsProvider: TTSProvider,
  params: SpeakParams
): Promise<{ audio: string; format: string }> {
  const buffer = await ttsProvider.synthesize(params.text, {
    emotion: params.emotion,
  });

  return {
    audio: buffer.toString('base64'),
    format: 'audio/wav',
  };
}
