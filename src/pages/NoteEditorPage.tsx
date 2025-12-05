import { useCallback, useEffect, useState } from 'react';

import { Link, useNavigate, useParams } from '@tanstack/react-router';

import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import { CollaborativeEditor } from '@/components/editor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { DEBOUNCE_DELAYS, formatNoteDateFull } from '@/lib';
import { useNotesStore } from '@/stores';

/**
 * Note editor page with collaborative editing
 * Uses Yjs for real-time collaboration between browser tabs
 */
export function NoteEditorPage() {
  const { noteId } = useParams({ from: '/notes/$noteId' });
  const navigate = useNavigate();

  const getNote = useNotesStore((state) => state.getNote);
  const updateNote = useNotesStore((state) => state.updateNote);

  const note = getNote(noteId);

  // Local state for editing
  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounced title for auto-save
  const debouncedTitle = useDebounce(title, DEBOUNCE_DELAYS.AUTO_SAVE);

  // Redirect if note not found
  useEffect(() => {
    if (!note) {
      navigate({ to: '/' });
    }
  }, [note, navigate]);

  // Auto-save title changes
  useEffect(() => {
    if (!note) return;

    if (debouncedTitle !== note.title) {
      setIsSaving(true);

      const timeout = setTimeout(() => {
        updateNote(noteId, { title: debouncedTitle });
        setIsSaving(false);
        setLastSaved(new Date());
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [debouncedTitle, note, noteId, updateNote]);

  // Update local title when note changes externally
  useEffect(() => {
    if (note) {
      setTitle(note.title);
    }
  }, [note?.id]);

  // Handle content changes from collaborative editor
  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      // Save content to store (Yjs handles collaboration)
      updateNote(noteId, { content: newContent });
      setLastSaved(new Date());
    },
    [noteId, updateNote]
  );

  if (!note) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Button>
        </Link>

        {/* Save status indicator */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
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

      {/* Title input */}
      <div className="mb-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="border-0 bg-transparent px-0 text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Metadata */}
      <div className="mb-6 text-sm text-[var(--muted-foreground)]">
        Last updated: {formatNoteDateFull(note.updatedAt)}
      </div>

      {/* Collaborative Editor */}
      <CollaborativeEditor
        noteId={noteId}
        initialContent={content}
        onUpdate={handleContentChange}
        placeholder="Start writing your note..."
      />

      {/* Collaboration hint */}
      <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
        Open this note in another browser tab to see real-time collaboration
      </p>
    </div>
  );
}
