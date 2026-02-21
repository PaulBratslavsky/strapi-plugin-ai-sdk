export type SSEEvent =
  | { type: 'text-delta'; delta: string }
  | { type: 'tool-input-available'; toolCallId: string; toolName: string; input: unknown }
  | { type: 'tool-output-available'; toolCallId: string; output: unknown };

function parseSSELine(line: string): SSEEvent | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return null;

  const payload = trimmed.slice(5).trim();
  if (payload === '[DONE]') return null;

  try {
    const parsed = JSON.parse(payload);
    switch (parsed.type) {
      case 'text-delta':
        return { type: 'text-delta', delta: parsed.delta };
      case 'tool-input-available':
        return {
          type: 'tool-input-available',
          toolCallId: parsed.toolCallId,
          toolName: parsed.toolName,
          input: parsed.input,
        };
      case 'tool-output-available':
        return {
          type: 'tool-output-available',
          toolCallId: parsed.toolCallId,
          output: parsed.output,
        };
      default:
        return null;
    }
  } catch {
    // skip malformed
  }
  return null;
}

export interface SSECallbacks {
  onTextDelta: (accumulated: string) => void;
  onToolInput?: (toolCallId: string, toolName: string, input: unknown) => void;
  onToolOutput?: (toolCallId: string, toolName: string, output: unknown) => void;
}

export async function readSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  callbacksOrOnDelta: SSECallbacks | ((accumulated: string) => void)
): Promise<string> {
  const callbacks: SSECallbacks =
    typeof callbacksOrOnDelta === 'function'
      ? { onTextDelta: callbacksOrOnDelta }
      : callbacksOrOnDelta;

  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';
  const toolNameMap = new Map<string, string>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const event = parseSSELine(line);
      if (!event) continue;

      switch (event.type) {
        case 'text-delta':
          accumulated += event.delta;
          callbacks.onTextDelta(accumulated);
          break;
        case 'tool-input-available':
          toolNameMap.set(event.toolCallId, event.toolName);
          callbacks.onToolInput?.(event.toolCallId, event.toolName, event.input);
          break;
        case 'tool-output-available': {
          const resolvedName = toolNameMap.get(event.toolCallId) ?? '';
          callbacks.onToolOutput?.(event.toolCallId, resolvedName, event.output);
          break;
        }
      }
    }
  }

  return accumulated;
}
