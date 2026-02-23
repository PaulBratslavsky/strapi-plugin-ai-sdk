import { Box, Button, TextInput } from '@strapi/design-system';
import { Sparkle, VolumeUp, VolumeMute } from '@strapi/icons';
import styled from 'styled-components';

// --- Styled Components ---

const InputArea = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 16px;
  border-top: 1px solid #eaeaef;
`;

const VoiceToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#4945ff' : '#dcdce4')};
  background: ${({ $active }) => ($active ? '#f0f0ff' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#4945ff' : '#a5a5ba')};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    border-color: #4945ff;
    color: #4945ff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// --- Component ---

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  voiceEnabled: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onToggleVoice: () => void;
}

export function ChatInput({
  input,
  isLoading,
  voiceEnabled,
  onInputChange,
  onSend,
  onToggleVoice,
}: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      <InputArea>
        <Box flex="1">
          <TextInput
            placeholder="Type your message..."
            aria-label="Chat message"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onInputChange(e.target.value)
            }
          />
        </Box>
        <VoiceToggle
          type="button"
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
          $active={voiceEnabled}
        >
          {voiceEnabled ? <VolumeUp /> : <VolumeMute />}
        </VoiceToggle>
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
  );
}
