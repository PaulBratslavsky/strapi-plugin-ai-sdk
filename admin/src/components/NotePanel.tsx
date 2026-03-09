import { useState, useEffect } from 'react';
import { Box, Typography, Modal, Textarea, TextInput, Field, SingleSelect, SingleSelectOption, Button, Flex } from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import styled from 'styled-components';
import type { Note } from '../utils/notes-api';

const PanelRoot = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? '300px' : '0px')};
  min-width: ${({ $open }) => ($open ? '300px' : '0px')};
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

const NoteList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const NoteItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral150};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral150};
  }

  &:hover .note-delete {
    opacity: 1;
  }
`;

const NoteContent = styled.div`
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

const TagsBadge = styled.span`
  display: inline-block;
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.primary100};
  color: ${({ theme }) => theme.colors.primary600};
  margin-left: 4px;
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

const NoteTitle = styled(Typography)`
  display: block;
  font-weight: 600;
  margin-bottom: 2px;
`;

const NotePreview = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WideModalContent = styled(Modal.Content)`
  max-width: 680px;
  width: 100%;
`;

interface EditNoteModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (documentId: string, data: { title?: string; content?: string; category?: string; tags?: string; source?: string }) => void;
}

function EditNoteModal({ note, open, onClose, onSave }: EditNoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('research');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    if (open && note) {
      setTitle(note.title || '');
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags || '');
      setSource(note.source || '');
    }
  }, [open, note]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!note || !content.trim()) return;
    onSave(note.documentId, { title, content, category, tags, source });
    handleClose();
  };

  return (
    <Modal.Root open={open} onOpenChange={(isOpen: boolean) => !isOpen && handleClose()}>
      <WideModalContent>
        <Modal.Header>
          <Modal.Title>Edit Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" gap={5} width="100%">
            <Field.Root width="100%">
              <Field.Label>Title</Field.Label>
              <TextInput
                placeholder="Short label for the note"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </Field.Root>
            <Field.Root width="100%">
              <Field.Label>Content</Field.Label>
              <Textarea
                placeholder="Note content (supports markdown)"
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                style={{ width: '100%', minHeight: '160px', fontFamily: 'monospace' }}
              />
            </Field.Root>
            <Flex gap={4} width="100%">
              <Field.Root style={{ flex: 1 }}>
                <Field.Label>Category</Field.Label>
                <SingleSelect
                  value={category}
                  onChange={(value: string) => setCategory(value)}
                >
                  <SingleSelectOption value="research">Research</SingleSelectOption>
                  <SingleSelectOption value="snippet">Snippet</SingleSelectOption>
                  <SingleSelectOption value="idea">Idea</SingleSelectOption>
                  <SingleSelectOption value="reference">Reference</SingleSelectOption>
                </SingleSelect>
              </Field.Root>
              <Field.Root style={{ flex: 1 }}>
                <Field.Label>Source</Field.Label>
                <TextInput
                  placeholder="e.g. conversation, URL"
                  value={source}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSource(e.target.value)}
                />
              </Field.Root>
            </Flex>
            <Field.Root width="100%">
              <Field.Label>Tags</Field.Label>
              <TextInput
                placeholder="Comma-separated tags"
                value={tags}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
              />
            </Field.Root>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
          <Button onClick={handleSave} disabled={!content.trim()}>
            Save changes
          </Button>
        </Modal.Footer>
      </WideModalContent>
    </Modal.Root>
  );
}

interface NotePanelProps {
  notes: Note[];
  open: boolean;
  onDelete: (documentId: string) => void;
  onEdit: (documentId: string, data: { title?: string; content?: string; category?: string; tags?: string; source?: string }) => void;
}

export function NotePanel({ notes, open, onDelete, onEdit }: NotePanelProps) {
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
  };

  const handleCloseModal = () => {
    setEditingNote(null);
  };

  const handleSave = (documentId: string, data: { title?: string; content?: string; category?: string; tags?: string; source?: string }) => {
    onEdit(documentId, data);
    setEditingNote(null);
  };

  return (
    <PanelRoot $open={open}>
      <PanelHeader>
        <Typography variant="sigma" textColor="neutral600">
          NOTES ({notes.length})
        </Typography>
      </PanelHeader>

      <NoteList>
        {notes.map((note) => (
          <NoteItem key={note.documentId} onClick={() => handleNoteClick(note)}>
            <NoteContent>
              <Flex gap={1} wrap="wrap" style={{ marginBottom: 2 }}>
                <CategoryBadge>{note.category}</CategoryBadge>
                {note.tags && note.tags.split(',').filter(Boolean).slice(0, 2).map((tag) => (
                  <TagsBadge key={tag.trim()}>{tag.trim()}</TagsBadge>
                ))}
              </Flex>
              {note.title && (
                <NoteTitle variant="omega" textColor="neutral800">
                  {note.title}
                </NoteTitle>
              )}
              <NotePreview variant="omega" textColor="neutral600">
                {note.content}
              </NotePreview>
            </NoteContent>
            <DeleteBtn
              className="note-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.documentId);
              }}
              aria-label="Delete note"
            >
              <Trash />
            </DeleteBtn>
          </NoteItem>
        ))}

        {notes.length === 0 && (
          <Box padding={4}>
            <Typography variant="omega" textColor="neutral500">
              No notes saved yet. Save research notes, snippets, and ideas during conversations.
            </Typography>
          </Box>
        )}
      </NoteList>

      <EditNoteModal
        note={editingNote}
        open={editingNote !== null}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </PanelRoot>
  );
}
