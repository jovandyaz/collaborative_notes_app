import { useCallback, useRef, useState } from 'react';

import { Link, useNavigate, useParams } from '@tanstack/react-router';

import { useNote, useUpdateNote } from '@knowtis/data-access-notes';
import { Button, Input } from '@knowtis/design-system';
import { useDebouncedCallback } from '@knowtis/shared-hooks';
import { AlertCircle, ArrowLeft, Check, Loader2 } from 'lucide-react';

import { CollaborativeEditor } from '@/components/editor';
import { DEBOUNCE_DELAYS, formatNoteDateFull } from '@/lib';

interface NoteEditorProps {
  noteId: string;
  initialTitle: string;
  initialContent: string;
  updatedAt: Date;
}

function NoteEditor({
  noteId,
  initialTitle,
  initialContent,
  updatedAt,
}: NoteEditorProps) {
  const updateNote = useUpdateNote();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const pendingUpdateRef = useRef(false);

  const debouncedUpdateNote = useDebouncedCallback(
    (updates: { title?: string; content?: string }) => {
      pendingUpdateRef.current = true;
      setIsPendingUpdate(true);
      updateNote.mutate(
        { id: noteId, input: updates },
        {
          onSuccess: () => {
            setLastSaved(new Date());
            pendingUpdateRef.current = false;
            setIsPendingUpdate(false);
          },
          onError: () => {
            pendingUpdateRef.current = false;
            setIsPendingUpdate(false);
          },
        }
      );
    },
    DEBOUNCE_DELAYS.AUTO_SAVE
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedUpdateNote({ title: newTitle });
  };

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      debouncedUpdateNote({ content: newContent });
    },
    [debouncedUpdateNote]
  );

  const isSaving = updateNote.isPending || isPendingUpdate;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </Link>

        <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Saved</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="mb-4">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="border-0 bg-transparent px-0 text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="mb-6 text-sm text-(--muted-foreground)">
        Last updated: {formatNoteDateFull(updatedAt)}
      </div>

      <CollaborativeEditor
        noteId={noteId}
        initialContent={content}
        onUpdate={handleContentChange}
        placeholder="Start writing your note..."
      />
    </div>
  );
}

export function NoteEditorPage() {
  const { noteId } = useParams({ from: '/notes/$noteId' });
  const navigate = useNavigate();

  const { data: note, isLoading, isError, error } = useNote(noteId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-(--primary)" />
          <p className="text-sm text-(--muted-foreground)">Loading note...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-(--destructive)" />
          </div>
          <p className="text-(--destructive) font-medium">
            Failed to load note
          </p>
          <p className="text-sm text-(--muted-foreground) mt-1 mb-4">
            {error instanceof Error ? error.message : 'Note not found'}
          </p>
          <Button onClick={() => navigate({ to: '/' })}>Back to Notes</Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <NoteEditor
      key={note.id}
      noteId={note.id}
      initialTitle={note.title}
      initialContent={note.content}
      updatedAt={note.updatedAt}
    />
  );
}
