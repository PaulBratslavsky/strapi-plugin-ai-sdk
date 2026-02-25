import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@strapi/design-system';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../hooks/useConversations';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTextReveal } from '../hooks/useTextReveal';
import { useAvatarAnimation } from '../context/AvatarAnimationContext';
import { AvatarPanel } from './AvatarPanel';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

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

const ToggleSidebarBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #dcdce4;
  border-radius: 4px;
  background: #ffffff;
  color: #666687;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #f0f0ff;
    color: #4945ff;
    border-color: #4945ff;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ChatTopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eaeaef;
  gap: 8px;
`;

// --- Component ---

export function Chat() {
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [awaitingAudio, setAwaitingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef('');
  const voiceRef = useRef(voiceEnabled);
  voiceRef.current = voiceEnabled;
  const prevIsLoadingRef = useRef(false);
  const { trigger, clearAnimation } = useAvatarAnimation();
  const { visibleText, startReveal, reset: resetReveal } = useTextReveal();
  const { speak, stop: stopAudio } = useAudioPlayer({
    onPlayStart: (duration) => {
      trigger('speak');
      startReveal(fullTextRef.current, duration);
      setAwaitingAudio(false);
    },
    onPlayEnded: () => clearAnimation(),
  });
  const {
    conversations,
    activeId,
    initialMessages,
    selectConversation,
    startNewConversation,
    saveMessages,
    removeConversation,
  } = useConversations();
  const { messages, sendMessage, isLoading, error } = useChat({
    initialMessages,
    conversationId: activeId,
    onAnimationTrigger: trigger,
    onStreamEnd: (fullText) => {
      if (!voiceRef.current) return;
      fullTextRef.current = fullText;
      if (!fullText) {
        setAwaitingAudio(false);
        clearAnimation();
      } else {
        speak(fullText);
      }
    },
  });

  // Auto-save when assistant response completes (isLoading transitions true -> false)
  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading && messages.length > 0) {
      saveMessages(messages);
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading, messages, saveMessages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    if (voiceEnabled) {
      fullTextRef.current = '';
      resetReveal();
      setAwaitingAudio(true);
    }
    sendMessage(input);
    setInput('');
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (!next) {
      stopAudio();
      resetReveal();
      setAwaitingAudio(false);
      clearAnimation();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, visibleText]);

  return (
    <ChatLayout>
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        open={sidebarOpen}
        onSelect={selectConversation}
        onNew={startNewConversation}
        onDelete={removeConversation}
      />
      <AvatarPanel />
      <ChatWrapper>
        <ChatTopBar>
          <ToggleSidebarBtn
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? 'Hide conversations' : 'Show conversations'}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="2" width="14" height="12" rx="1.5" />
              <line x1="5.5" y1="2" x2="5.5" y2="14" />
            </svg>
          </ToggleSidebarBtn>
        </ChatTopBar>
        <MessageList
          ref={messagesEndRef}
          messages={messages}
          isLoading={isLoading}
          awaitingAudio={awaitingAudio}
          voiceEnabled={voiceEnabled}
          visibleText={visibleText}
        />

        {error && (
          <Box padding={3} background="danger100" marginLeft={4} marginRight={4}>
            <Typography textColor="danger600">Error: {error}</Typography>
          </Box>
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          voiceEnabled={voiceEnabled}
          onInputChange={setInput}
          onSend={handleSend}
          onToggleVoice={handleToggleVoice}
        />
      </ChatWrapper>
    </ChatLayout>
  );
}
