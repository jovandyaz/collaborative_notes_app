import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS, generateId } from '@/lib';
import type { CreateNoteInput, Note, UpdateNoteInput } from '@/types';

import type { NotesStore } from './notesStore.types';

const INITIAL_NOTES: Note[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Welcome to Collaborative Notes',
    content:
      '<p>This is your first note! You can <strong>format text</strong> with <em>rich editing</em> features.</p><p>Try opening this app in multiple browser tabs to see real-time collaboration in action.</p>',
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    title: 'Getting Started Guide',
    content:
      '<p>Here are some things you can do:</p><ul><li>Create new notes with the + button</li><li>Edit notes by clicking on them</li><li>Use formatting tools for <strong>bold</strong>, <em>italic</em>, and <u>underline</u></li><li>Create bullet lists and numbered lists</li></ul>',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    updatedAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    title: 'Meeting Notes - Project Kickoff',
    content:
      '<p><strong>Attendees:</strong> Alice, Bob, Charlie</p><p><strong>Topics Discussed:</strong></p><ol><li>Project timeline and milestones</li><li>Resource allocation</li><li>Risk assessment</li></ol><p><strong>Action Items:</strong></p><ul><li>Alice: Create project plan</li><li>Bob: Set up development environment</li><li>Charlie: Schedule follow-up meeting</li></ul>',
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
    updatedAt: Date.now() - 3600000 * 5, // 5 hours ago
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    title: 'Ideas & Brainstorming',
    content:
      '<p>Random ideas to explore:</p><ul><li>Implement dark mode toggle</li><li>Add note categories/tags</li><li>Export notes to PDF</li><li>Share notes via link</li></ul><p>Priority: <em>High</em></p>',
    createdAt: Date.now() - 3600000 * 12, // 12 hours ago
    updatedAt: Date.now() - 3600000 * 2, // 2 hours ago
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    title: 'Quick Note',
    content: '<p>Remember to review the PR before end of day!</p>',
    createdAt: Date.now() - 1800000, // 30 minutes ago
    updatedAt: Date.now() - 1800000, // 30 minutes ago
  },
];

/**
 * Zustand store for managing notes
 * Persisted to localStorage for data persistence
 */
export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: INITIAL_NOTES,
      searchQuery: '',

      // Create a new note
      createNote: (input: CreateNoteInput) => {
        const now = Date.now();
        const newNote: Note = {
          id: generateId(),
          title: input.title,
          content: input.content ?? '',
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          notes: [newNote, ...state.notes],
        }));

        return newNote;
      },

      // Update an existing note
      updateNote: (id: string, input: UpdateNoteInput) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...input,
                  updatedAt: Date.now(),
                }
              : note
          ),
        }));
      },

      // Delete a note
      deleteNote: (id: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      // Get a single note by ID
      getNote: (id: string) => {
        return get().notes.find((note) => note.id === id);
      },

      // Set search query
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      // Get filtered notes based on search query
      getFilteredNotes: () => {
        const { notes, searchQuery } = get();

        if (!searchQuery.trim()) {
          // Sort by updatedAt (most recent first)
          return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
        }

        const query = searchQuery.toLowerCase();
        return notes
          .filter(
            (note) =>
              note.title.toLowerCase().includes(query) ||
              note.content.toLowerCase().includes(query)
          )
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },

      // Reset to initial notes (for testing/demo)
      resetToInitial: () => {
        set({ notes: INITIAL_NOTES, searchQuery: '' });
      },
    }),
    {
      name: STORAGE_KEYS.NOTES,
      // Only persist notes, not search query
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);
