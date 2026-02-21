import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextInput } from '@strapi/design-system';
import { Sparkle } from '@strapi/icons';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import { useChat, type ToolCall } from '../hooks/useChat';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTextReveal } from '../hooks/useTextReveal';
import { useAvatarAnimation } from '../context/AvatarAnimationContext';
import { AvatarPanel } from './AvatarPanel';
import waifuAvatar from './waifu-avatar.png';

// --- Styled Components ---

const ChatLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 200px);
  min-height: 400px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(33, 33, 52, 0.1);
  background: #ffffff;
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  max-width: 80%;
`;

const Avatar = styled.img`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  min-width: 0;
  background-color: ${({ $isUser }) => ($isUser ? '#4945ff' : '#f6f6f9')};
  color: ${({ $isUser }) => ($isUser ? '#ffffff' : '#32324d')};
  border-radius: ${({ $isUser }) =>
    $isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  padding: 12px 16px;
  font-size: 15px;
  word-break: break-word;
  line-height: 1.6;
`;

const MarkdownBody = styled.div<{ $isUser: boolean }>`
  p { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  ul, ol { margin: 4px 0; padding-left: 20px; }
  li { margin: 2px 0; }
  code {
    font-size: 0.85em;
    padding: 1px 4px;
    border-radius: 3px;
    background: ${({ $isUser }) => ($isUser ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)')};
  }
  pre {
    margin: 8px 0;
    padding: 8px 10px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 0.85em;
    background: ${({ $isUser }) => ($isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)')};
    code { padding: 0; background: none; }
  }
  h1, h2, h3, h4 { margin: 12px 0 4px; &:first-child { margin-top: 0; } }
  h1 { font-size: 1.3em; } h2 { font-size: 1.15em; } h3 { font-size: 1.05em; }
  blockquote {
    margin: 8px 0;
    padding-left: 12px;
    border-left: 3px solid ${({ $isUser }) => ($isUser ? 'rgba(255,255,255,0.3)' : '#dcdce4')};
    opacity: 0.85;
  }
  a { color: ${({ $isUser }) => ($isUser ? '#c0cfff' : '#4945ff')}; }
  table { border-collapse: collapse; margin: 8px 0; font-size: 0.9em; }
  th, td { border: 1px solid ${({ $isUser }) => ($isUser ? 'rgba(255,255,255,0.2)' : '#dcdce4')}; padding: 4px 8px; }
`;

const MessageRole = styled.div<{ $isUser: boolean }>`
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.7;
  color: ${({ $isUser }) => ($isUser ? '#ffffff' : '#666687')};
`;

const InputArea = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 16px;
  border-top: 1px solid #eaeaef;
`;

const TypingDots = styled.span`
  display: inline-flex;
  gap: 4px;

  span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #a5a5ba;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  span:nth-child(1) { animation-delay: 0s; }
  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #a5a5ba;
`;

const ToolCallBox = styled.div`
  margin-top: 8px;
  border: 1px solid #dcdce4;
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
`;

const ToolCallHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: #eaeaef;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #32324d;
  text-align: left;

  &:hover {
    background: #dcdce4;
  }
`;

const ToolCallContent = styled.pre`
  margin: 0;
  padding: 8px 12px;
  background: #fafafa;
  font-size: 11px;
  line-height: 1.4;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

// --- Tool Call Component ---

const HIDDEN_TOOLS = new Set(['triggerAnimation']);

function ToolCallDisplay({ toolCall }: Readonly<{ toolCall: ToolCall }>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ToolCallBox>
      <ToolCallHeader onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? '\u25BC' : '\u25B6'}</span>
        <span>Tool: {toolCall.toolName}</span>
        {toolCall.output !== undefined && (
          <span style={{ marginLeft: 'auto', fontWeight: 400, opacity: 0.6 }}>
            completed
          </span>
        )}
      </ToolCallHeader>
      {expanded && (
        <ToolCallContent>
          {toolCall.output === undefined
            ? 'Waiting for result...'
            : JSON.stringify(toolCall.output, null, 2)}
        </ToolCallContent>
      )}
    </ToolCallBox>
  );
}

// --- Component ---

export function Chat() {
  const [input, setInput] = useState('');
  const [awaitingAudio, setAwaitingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef('');
  const { trigger, clearAnimation } = useAvatarAnimation();
  const { visibleText, startReveal, reset: resetReveal } = useTextReveal();
  const { speak } = useAudioPlayer({
    onPlayStart: (duration) => {
      trigger('speak');
      startReveal(fullTextRef.current, duration);
      setAwaitingAudio(false);
    },
    onPlayEnded: () => clearAnimation(),
  });
  const { messages, sendMessage, isLoading, error } = useChat({
    onAnimationTrigger: trigger,
    onStreamEnd: (fullText) => {
      fullTextRef.current = fullText;
      if (!fullText) {
        setAwaitingAudio(false);
        clearAnimation();
      } else {
        speak(fullText);
      }
    },
  });

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    fullTextRef.current = '';
    resetReveal();
    setAwaitingAudio(true);
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visibleText]);

  return (
    <ChatLayout>
      <AvatarPanel />
      <ChatWrapper>
        <MessagesArea>
          {messages.length === 0 && (
            <EmptyState>
              <Typography variant="beta" textColor="neutral400">
                AI Chat
              </Typography>
              <Box paddingTop={2}>
                <Typography variant="omega" textColor="neutral500">
                  Send a message to start the conversation
                </Typography>
              </Box>
            </EmptyState>
          )}

          {messages.map((message, index) => {
            const isLatestAssistant =
              message.role === 'assistant' &&
              index === messages.length - 1;
            // For the latest assistant message during audio reveal, show visibleText
            // For all other messages, show full content
            const displayContent =
              isLatestAssistant && (awaitingAudio || visibleText)
                ? visibleText
                : message.content;

            return (
            <MessageRow key={message.id} $isUser={message.role === 'user'}>
              {message.role === 'assistant' && (
                <Avatar src={waifuAvatar} alt="Assistant" />
              )}
              <MessageBubble $isUser={message.role === 'user'}>
                <MessageRole $isUser={message.role === 'user'}>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </MessageRole>
                {message.role === 'user' && message.content}
                {message.role === 'assistant' && displayContent && (
                  <MarkdownBody $isUser={false}>
                    <Markdown>{displayContent}</Markdown>
                  </MarkdownBody>
                )}
                {message.role === 'assistant' && !displayContent && (isLoading || awaitingAudio) && (
                  <TypingDots><span /><span /><span /></TypingDots>
                )}
                {message.toolCalls
                  ?.filter((tc) => !HIDDEN_TOOLS.has(tc.toolName))
                  .map((tc) => (
                    <ToolCallDisplay key={tc.toolCallId} toolCall={tc} />
                  ))}
              </MessageBubble>
            </MessageRow>
            );
          })}

          <div ref={messagesEndRef} />
        </MessagesArea>

        {error && (
          <Box padding={3} background="danger100" marginLeft={4} marginRight={4}>
            <Typography textColor="danger600">Error: {error}</Typography>
          </Box>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <InputArea>
            <Box flex="1">
              <TextInput
                placeholder="Type your message..."
                aria-label="Chat message"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
              />
            </Box>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              loading={isLoading}
              size="L"
              startIcon={<Sparkle />}
            >
              Send
            </Button>
          </InputArea>
        </form>
      </ChatWrapper>
    </ChatLayout>
  );
}
