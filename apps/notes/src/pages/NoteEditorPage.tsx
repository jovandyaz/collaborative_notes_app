import { useCallback, useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from '@tanstack/react-router';

import type { Note } from '@knowtis/data-access-notes';
import { Button, Input } from '@knowtis/design-system';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import { CollaborativeEditor } from '@/components/editor';
import { useDebouncedCallback } from '@/hooks';
import { DEBOUNCE_DELAYS, formatNoteDateFull } from '@/lib';
import { useNotesStore } from '@/stores';

function NoteEditor({ note }: { note: Note }) {
  const updateNote = useNotesStore((state) => state.updateNote);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const isSaving = title !== note.title || content !== note.content;

  const debouncedUpdateNote = useDebouncedCallback((updates: Partial<Note>) => {
    updateNote(note.id, updates);
    setLastSaved(new Date());
  }, DEBOUNCE_DELAYS.AUTO_SAVE);

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
        Last updated: {formatNoteDateFull(note.updatedAt)}
      </div>

      <CollaborativeEditor
        noteId={note.id}
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

  const note = useNotesStore((state) =>
    state.notes.find((n) => n.id === noteId)
  );

  useEffect(() => {
    if (!note) {
      navigate({ to: '/' });
    }
  }, [note, navigate]);

  if (!note) {
    return null;
  }

  return <NoteEditor key={note.id} note={note} />;
}
