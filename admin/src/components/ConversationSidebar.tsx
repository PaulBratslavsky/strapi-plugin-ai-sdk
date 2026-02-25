import { Box, Typography } from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';
import styled from 'styled-components';
import type { ConversationSummary } from '../utils/conversations-api';

const SidebarRoot = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '260px' : '0px')};
  min-width: ${({ $open }) => ($open ? '260px' : '0px')};
  display: flex;
  flex-direction: column;
  border-right: ${({ $open, theme }) => ($open ? `1px solid ${theme.colors.neutral200}` : 'none')};
  background: ${({ theme }) => theme.colors.neutral100};
  overflow: hidden;
  transition: width 0.2s ease, min-width 0.2s ease;
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.neutral0};
  color: ${({ theme }) => theme.colors.neutral800};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral100};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.colors.neutral200 : 'transparent')};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral200};
  }

  &:hover .delete-btn {
    opacity: 1;
  }
`;

const DeleteBtn = styled.button`
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral600};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral300};
    color: ${({ theme }) => theme.colors.danger600};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TitleText = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
`;

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  open: boolean;
  onSelect: (documentId: string) => void;
  onNew: () => void;
  onDelete: (documentId: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  open,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <SidebarRoot $open={open}>
      <Box padding={3}>
        <NewChatButton onClick={onNew}>
          <Plus />
          New Chat
        </NewChatButton>
      </Box>

      <ConversationList>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.documentId}
            $active={conv.documentId === activeId}
            onClick={() => onSelect(conv.documentId)}
          >
            <TitleText variant="omega" textColor="neutral800">
              {conv.title}
            </TitleText>
            <DeleteBtn
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.documentId);
              }}
              aria-label="Delete conversation"
            >
              <Trash />
            </DeleteBtn>
          </ConversationItem>
        ))}

        {conversations.length === 0 && (
          <Box padding={4}>
            <Typography variant="omega" textColor="neutral500">
              No conversations yet
            </Typography>
          </Box>
        )}
      </ConversationList>
    </SidebarRoot>
  );
}
