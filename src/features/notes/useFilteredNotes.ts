import { useMemo } from 'react';

import { useNotesStore } from '@/stores';
import type { Note } from '@/types';

/**
 * Hook for getting filtered and sorted notes
 * Memoized for performance optimization
 */
export function useFilteredNotes(searchQuery: string): Note[] {
  const notes = useNotesStore((state) => state.notes);

  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    // Filter notes based on search query
    const filtered = query
      ? notes.filter(
          (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        )
      : notes;

    // Sort by updatedAt (most recent first)
    return [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, searchQuery]);
}
