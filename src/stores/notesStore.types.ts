import type { CreateNoteInput, Note, UpdateNoteInput } from '@/types';

/**
 * Notes store state interface
 */
export interface NotesState {
  notes: Note[];
  searchQuery: string;
}

/**
 * Notes store actions interface
 */
export interface NotesActions {
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;

  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];

  resetToInitial: () => void;
}

export type NotesStore = NotesState & NotesActions;
