import { useState, useCallback } from 'react';
import { PLUGIN_ID } from '../pluginId';
import { getToken, getBackendURL } from '../utils/auth';
import { readSSEStream } from '../utils/sse';

export interface ToolCall {
  toolCallId: string;
  toolName: string;
  input: unknown;
  output?: unknown;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCall[];
}

type SetMessages = React.Dispatch<React.SetStateAction<Message[]>>;

function generateId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function toUIMessages(messages: Message[]) {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: 'text' as const, text: message.content }],
  }));
}

async function fetchChatStream(messages: Message[]): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const token = getToken();
  const response = await fetch(`${getBackendURL()}/${PLUGIN_ID}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages: toUIMessages(messages) }),
  });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream');
  return reader;
}

function updateMessage(setMessages: SetMessages, id: string, updater: (m: Message) => Message) {
  setMessages((prev) => prev.map((message) => (message.id === id ? updater(message) : message)));
}

function removeMessage(setMessages: SetMessages, id: string) {
  setMessages((prev) => prev.filter((message) => message.id !== id));
}

function addToolCall(setMessages: SetMessages, assistantId: string, toolCallId: string, toolName: string, input: unknown) {
  updateMessage(setMessages, assistantId, (message) => ({
    ...message,
    toolCalls: [...(message.toolCalls ?? []), { toolCallId, toolName, input }],
  }));
}

function updateToolOutput(setMessages: SetMessages, assistantId: string, toolCallId: string, output: unknown) {
  updateMessage(setMessages, assistantId, (message) => ({
    ...message,
    toolCalls: message.toolCalls?.map((tc) =>
      tc.toolCallId === toolCallId ? { ...tc, output } : tc
    ),
  }));
}

export interface UseChatOptions {
  onAnimationTrigger?: (animation: string) => void;
  onStreamStart?: () => void;
  onStreamEnd?: (fullText: string) => void;
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = { id: generateId(), role: 'user', content: trimmed };
      const assistantId = generateId();

      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: 'assistant', content: '' }]);
      setIsLoading(true);
      setError(null);

      try {
        const reader = await fetchChatStream([...messages, userMessage]);

        let streamStarted = false;
        const result = await readSSEStream(reader, {
          onTextDelta: (content) => {
            if (!streamStarted) {
              streamStarted = true;
              options?.onStreamStart?.();
            }
            updateMessage(setMessages, assistantId, (message) => ({ ...message, content }));
          },
          onToolInput: (toolCallId, toolName, input) => {
            if (toolName === 'triggerAnimation' && input && typeof input === 'object' && 'animation' in input) {
              options?.onAnimationTrigger?.(String((input as { animation: string }).animation));
            }
            addToolCall(setMessages, assistantId, toolCallId, toolName, input);
          },
          onToolOutput: (toolCallId, _toolName, output) => {
            updateToolOutput(setMessages, assistantId, toolCallId, output);
          },
        });

        if (result) {
          options?.onStreamEnd?.(result);
        }

        if (!result) {
          updateMessage(setMessages, assistantId, (message) => ({ ...message, content: message.content || 'No response received.' }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        removeMessage(setMessages, assistantId);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, sendMessage, clearMessages, isLoading, error };
}
