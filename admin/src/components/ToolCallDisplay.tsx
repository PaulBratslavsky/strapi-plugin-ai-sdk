import { useState } from 'react';
import styled from 'styled-components';
import type { ToolCall } from '../hooks/useChat';

// --- Styled Components ---

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

// --- Component ---

export const HIDDEN_TOOLS = new Set(['triggerAnimation']);

export function ToolCallDisplay({ toolCall }: Readonly<{ toolCall: ToolCall }>) {
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
