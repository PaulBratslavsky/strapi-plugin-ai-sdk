import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@strapi/design-system';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../hooks/useConversations';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTextReveal } from '../hooks/useTextReveal';
import { useAvatarAnimation } from '../context/AvatarAnimationContext';
import { useMemories } from '../hooks/useMemories';
import { PLUGIN_ID } from '../pluginId';
import { AvatarPanel } from './AvatarPanel';
import { ConversationSidebar } from './ConversationSidebar';
import { MemoryPanel } from './MemoryPanel';
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
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryPanelOpen, setMemoryPanelOpen] = useState(false);
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
  const { memories, removeMemory, refresh: refreshMemories } = useMemories();
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
      refreshMemories();
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading, messages, saveMessages, refreshMemories]);

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
          <ToggleSidebarBtn
            onClick={() => navigate(`/plugins/${PLUGIN_ID}/memory-store`)}
            aria-label="Memory Store"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4h12M2 8h12M2 12h8" />
            </svg>
          </ToggleSidebarBtn>
          <ToggleSidebarBtn
            onClick={() => navigate(`/plugins/${PLUGIN_ID}/public-memory-store`)}
            aria-label="Public Memory Store"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="6" />
              <ellipse cx="8" cy="8" rx="2.5" ry="6" />
              <path d="M2 8h12" />
            </svg>
          </ToggleSidebarBtn>
          <ToggleSidebarBtn
            onClick={() => navigate(`/plugins/${PLUGIN_ID}/widget-preview`)}
            aria-label="Widget Preview"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="4 4 8 2 12 4" />
              <polyline points="4 4 4 10 8 12 12 10 12 4" />
              <line x1="8" y1="2" x2="8" y2="12" />
            </svg>
          </ToggleSidebarBtn>
          <div style={{ flex: 1 }} />
          <ToggleSidebarBtn
            onClick={() => setMemoryPanelOpen((prev) => !prev)}
            aria-label={memoryPanelOpen ? 'Hide memories' : 'Show memories'}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="6" r="4" />
              <path d="M4 10.5C4 10.5 5 14 8 14s4-3.5 4-3.5" />
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
      <MemoryPanel
        memories={memories}
        open={memoryPanelOpen}
        onDelete={removeMemory}
      />
    </ChatLayout>
  );
}
