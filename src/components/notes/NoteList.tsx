import { useCallback, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { Search, Sparkles } from 'lucide-react';

import { useFilteredNotes } from '@/features/notes';
import { useDebounce } from '@/hooks';
import { DEBOUNCE_DELAYS } from '@/lib';
import { useNotesStore } from '@/stores';

import { Input } from '../ui/Input';
import { CreateNoteDialog } from './CreateNoteDialog';
import { DeleteNoteDialog } from './DeleteNoteDialog';
import { NoteCard } from './NoteCard';

/**
 * Main component for displaying the list of notes
 * Includes search functionality and CRUD dialogs
 * Optimized with memoization and debounced search
 */
export function NoteList() {
  const notes = useNotesStore((state) => state.notes);

  const [localSearch, setLocalSearch] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Debounce search to avoid excessive filtering
  const debouncedSearch = useDebounce(localSearch, DEBOUNCE_DELAYS.SEARCH);

  // Get filtered notes using memoized hook
  const filteredNotes = useFilteredNotes(debouncedSearch);

  const noteToDeleteData = notes.find((n) => n.id === noteToDelete);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    setNoteToDelete(id);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header with search and create button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-10 h-11 bg-card/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/30 transition-all"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <CreateNoteDialog />
      </div>

      {/* Notes grid */}
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredNotes.length === 0 ? (
            <motion.div
              layout
              className="col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState hasSearch={!!debouncedSearch} />
            </motion.div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delete confirmation dialog */}
      <DeleteNoteDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        noteId={noteToDelete}
        noteTitle={noteToDeleteData?.title ?? ''}
      />
    </div>
  );
}

/**
 * Empty state component when no notes exist or search has no results
 */
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 py-20 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
        {hasSearch ? (
          <Search className="h-10 w-10 text-muted-foreground/50" />
        ) : (
          <Sparkles className="h-10 w-10 text-primary/50" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        {hasSearch ? 'No notes found' : 'Start your collection'}
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {hasSearch
          ? `We couldn't find any notes matching your search. Try a different term.`
          : 'Create your first note to get started capturing your ideas.'}
      </p>
      {!hasSearch && (
        <div className="mt-8">
          <CreateNoteDialog />
        </div>
      )}
    </motion.div>
  );
}
