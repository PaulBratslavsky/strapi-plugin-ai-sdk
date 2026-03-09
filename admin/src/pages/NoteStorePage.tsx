import { useState, useMemo, useEffect } from 'react';
import {
  Main,
  Box,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Flex,
  Button,
  Textarea,
  Modal,
  Field,
  SingleSelect,
  SingleSelectOption,
  Pagination,
  SearchForm,
  Searchbar,
  TextInput,
  Dialog,
} from '@strapi/design-system';
import { Pencil, Trash, ArrowLeft, Plus, WarningCircle } from '@strapi/icons';
import { Layouts } from '@strapi/strapi/admin';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useNotes } from '../hooks/useNotes';
import { PLUGIN_ID } from '../pluginId';
import type { Note } from '../utils/notes-api';

const PAGE_SIZE = 10;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.neutral600};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral200};
    color: ${({ theme }) => theme.colors.primary600};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DeleteActionBtn = styled(ActionBtn)`
  &:hover {
    color: ${({ theme }) => theme.colors.danger600};
  }
`;

const WideModalContent = styled(Modal.Content)`
  max-width: 680px;
  width: 100%;
`;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface NoteModalProps {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string; category: string; tags: string; source: string }, documentId?: string) => void;
}

function NoteModal({ note, open, onClose, onSave }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('research');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');
  const isEdit = note !== null;

  useEffect(() => {
    if (open && note) {
      setTitle(note.title || '');
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags || '');
      setSource(note.source || '');
    } else if (open) {
      setTitle('');
      setContent('');
      setCategory('research');
      setTags('');
      setSource('');
    }
  }, [open, note]);

  const handleClose = () => {
    setTitle('');
    setContent('');
    setCategory('research');
    setTags('');
    setSource('');
    onClose();
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({ title, content, category, tags, source }, note?.documentId);
    handleClose();
  };

  return (
    <Modal.Root open={open} onOpenChange={(isOpen: boolean) => !isOpen && handleClose()}>
      <WideModalContent>
        <Modal.Header>
          <Modal.Title>{isEdit ? 'Edit Note' : 'Add Note'}</Modal.Title>
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
                style={{ width: '100%', minHeight: '160px', maxHeight: '300px', overflow: 'auto', fontFamily: 'monospace' }}
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
                placeholder="Comma-separated tags (e.g. strapi, api, tutorial)"
                value={tags}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
              />
              <Field.Hint>Used to filter and organize notes</Field.Hint>
            </Field.Root>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">Cancel</Button>
          </Modal.Close>
          <Button onClick={handleSave} disabled={!content.trim()}>
            {isEdit ? 'Save changes' : 'Add note'}
          </Button>
        </Modal.Footer>
      </WideModalContent>
    </Modal.Root>
  );
}

const NoteStorePage = () => {
  const navigate = useNavigate();
  const { notes, loading, addNote, editNote, removeNote, clearAll } = useNotes();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        (n.tags || '').toLowerCase().includes(q)
    );
  }, [notes, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleSave = (data: { title: string; content: string; category: string; tags: string; source: string }, documentId?: string) => {
    if (documentId) {
      editNote(documentId, data);
    } else {
      addNote(data);
    }
  };

  const handleClearAll = () => {
    clearAll();
    setClearDialogOpen(false);
  };

  return (
    <Main>
      <Layouts.Header
        title="Research Notes"
        subtitle={`${notes.length} notes saved`}
        primaryAction={
          <Flex gap={2}>
            <Button variant="danger-light" onClick={() => setClearDialogOpen(true)} disabled={notes.length === 0}>
              Clear all
            </Button>
            <Button startIcon={<Plus />} onClick={handleOpenCreate}>
              Add note
            </Button>
          </Flex>
        }
        navigationAction={
          <Button variant="ghost" startIcon={<ArrowLeft />} onClick={() => navigate(`/plugins/${PLUGIN_ID}`)}>
            Back to Chat
          </Button>
        }
      />
      <Layouts.Content>
        <Box paddingBottom={4}>
          <SearchForm>
            <Searchbar
              name="search"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearch('');
                setPage(1);
              }}
              placeholder="Search notes..."
            >
              Search
            </Searchbar>
          </SearchForm>
        </Box>

        <Table colCount={6} rowCount={paginated.length + 1}>
          <Thead>
            <Tr>
              <Th><Typography variant="sigma">Title</Typography></Th>
              <Th><Typography variant="sigma">Content</Typography></Th>
              <Th><Typography variant="sigma">Category</Typography></Th>
              <Th><Typography variant="sigma">Tags</Typography></Th>
              <Th><Typography variant="sigma">Created</Typography></Th>
              <Th><Typography variant="sigma">Actions</Typography></Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && (
              <Tr>
                <Td colSpan={6}>
                  <Box padding={4}>
                    <Typography textColor="neutral600">Loading...</Typography>
                  </Box>
                </Td>
              </Tr>
            )}
            {!loading && paginated.length === 0 && (
              <Tr>
                <Td colSpan={6}>
                  <Box padding={4}>
                    <Typography textColor="neutral500">
                      {search ? 'No notes match your search' : 'No notes saved yet. Save research notes, snippets, and ideas during conversations.'}
                    </Typography>
                  </Box>
                </Td>
              </Tr>
            )}
            {paginated.map((note) => (
              <Tr key={note.documentId}>
                <Td>
                  <Typography textColor="neutral800" fontWeight="semiBold">
                    {note.title || '—'}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800" ellipsis>
                    {note.content.length > 100 ? `${note.content.slice(0, 100)}...` : note.content}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral600">{note.category}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral600">{note.tags || '—'}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral600">{formatDate(note.createdAt)}</Typography>
                </Td>
                <Td>
                  <Flex gap={1}>
                    <ActionBtn
                      onClick={() => handleOpenEdit(note)}
                      aria-label="Edit note"
                    >
                      <Pencil />
                    </ActionBtn>
                    <DeleteActionBtn
                      onClick={() => removeNote(note.documentId)}
                      aria-label="Delete note"
                    >
                      <Trash />
                    </DeleteActionBtn>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {pageCount > 1 && (
          <Box paddingTop={4}>
            <Flex justifyContent="center">
              <Pagination.Root pageCount={pageCount} activePage={page} onPageChange={setPage}>
                <Pagination.Links />
              </Pagination.Root>
            </Flex>
          </Box>
        )}

        <NoteModal
          note={editingNote}
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />

        <Dialog.Root open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
          <Dialog.Content>
            <Dialog.Header>Clear all notes</Dialog.Header>
            <Dialog.Body icon={<WarningCircle />}>
              Are you sure you want to delete all {notes.length} notes? This action cannot be undone.
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Cancel>
                <Button variant="tertiary">Cancel</Button>
              </Dialog.Cancel>
              <Dialog.Action>
                <Button variant="danger" onClick={handleClearAll}>
                  Clear all
                </Button>
              </Dialog.Action>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Layouts.Content>
    </Main>
  );
};

export { NoteStorePage };
