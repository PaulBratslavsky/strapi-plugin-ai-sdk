import type { UIMessage } from 'ai';

/**
 * Trim messages to a max count while keeping tool call/result pairs intact.
 *
 * When slicing from the end, the first remaining message might be an assistant
 * message with tool invocations whose results lived in earlier (now-dropped)
 * messages. The AI SDK throws MissingToolResultsError if it encounters an
 * unmatched tool call. This function drops leading assistant messages that
 * contain tool invocations to prevent that.
 */
export function trimMessages(messages: UIMessage[], max: number): UIMessage[] {
  if (messages.length <= max) return messages;

  const sliced = messages.slice(-max);

  // Drop leading messages until we have a clean start (user message or
  // assistant message without tool invocations)
  while (sliced.length > 0 && hasOrphanedToolCalls(sliced[0])) {
    sliced.shift();
  }

  return sliced;
}

function hasOrphanedToolCalls(message: UIMessage): boolean {
  if (message.role !== 'assistant') return false;

  // Check parts for tool invocations
  if (message.parts) {
    return message.parts.some(
      (part) => part.type === 'tool-invocation'
    );
  }

  // Legacy: check toolInvocations
  if ((message as any).toolInvocations?.length) {
    return true;
  }

  return false;
}
