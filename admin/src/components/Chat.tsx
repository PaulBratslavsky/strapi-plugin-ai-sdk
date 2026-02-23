import { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@strapi/design-system';
import styled from 'styled-components';
import { useChat } from '../hooks/useChat';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useTextReveal } from '../hooks/useTextReveal';
import { useAvatarAnimation } from '../context/AvatarAnimationContext';
import { AvatarPanel } from './AvatarPanel';
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

// --- Component ---

export function Chat() {
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [awaitingAudio, setAwaitingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef('');
  const voiceRef = useRef(voiceEnabled);
  voiceRef.current = voiceEnabled;
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
  const { messages, sendMessage, isLoading, error } = useChat({
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
      <AvatarPanel />
      <ChatWrapper>
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
