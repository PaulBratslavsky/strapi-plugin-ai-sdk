import { Box, Typography } from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import styled from 'styled-components';
import type { Memory } from '../utils/memories-api';

const PanelRoot = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '280px' : '0px')};
  min-width: ${({ $open }) => ($open ? '280px' : '0px')};
  display: flex;
  flex-direction: column;
  border-left: ${({ $open, theme }) => ($open ? `1px solid ${theme.colors.neutral200}` : 'none')};
  background: ${({ theme }) => theme.colors.neutral100};
  overflow: hidden;
  transition: width 0.2s ease, min-width 0.2s ease;
`;

const PanelHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral200};
`;

const MemoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const MemoryItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 16px;

  &:hover .memory-delete {
    opacity: 1;
  }
`;

const MemoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.neutral200};
  color: ${({ theme }) => theme.colors.neutral600};
  margin-bottom: 2px;
`;

const DeleteBtn = styled.button`
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral500};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral300};
    color: ${({ theme }) => theme.colors.danger600};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

interface MemoryPanelProps {
  memories: Memory[];
  open: boolean;
  onDelete: (documentId: string) => void;
}

export function MemoryPanel({ memories, open, onDelete }: MemoryPanelProps) {
  return (
    <PanelRoot $open={open}>
      <PanelHeader>
        <Typography variant="sigma" textColor="neutral600">
          MEMORIES ({memories.length})
        </Typography>
      </PanelHeader>

      <MemoryList>
        {memories.map((mem) => (
          <MemoryItem key={mem.documentId}>
            <MemoryContent>
              <CategoryBadge>{mem.category}</CategoryBadge>
              <Typography variant="omega" textColor="neutral800" style={{ display: 'block' }}>
                {mem.content}
              </Typography>
            </MemoryContent>
            <DeleteBtn
              className="memory-delete"
              onClick={() => onDelete(mem.documentId)}
              aria-label="Delete memory"
            >
              <Trash />
            </DeleteBtn>
          </MemoryItem>
        ))}

        {memories.length === 0 && (
          <Box padding={4}>
            <Typography variant="omega" textColor="neutral500">
              No memories saved yet. The AI will save facts about you as you chat.
            </Typography>
          </Box>
        )}
      </MemoryList>
    </PanelRoot>
  );
}
