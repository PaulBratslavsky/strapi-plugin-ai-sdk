import { Box, Button, TextInput } from '@strapi/design-system';
import { Sparkle } from '@strapi/icons';
import styled from 'styled-components';

// --- Styled Components ---

const InputArea = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 16px;
  border-top: 1px solid #eaeaef;
`;

// --- Component ---

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSend,
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
