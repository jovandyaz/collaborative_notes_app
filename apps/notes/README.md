# Notes App Architecture

This document details the specific architectural implementation of the **Notes** application.

## Table of Contents

1. [State Management](#state-management)
2. [Real-time Collaboration](#real-time-collaboration)
3. [Rich Text Editor](#rich-text-editor)
4. [Performance Optimizations](#performance-optimizations)
5. [Testing Collaboration](#testing-collaboration)

---

## State Management

### Zustand Store

We use [Zustand](https://github.com/pmndrs/zustand) for global state management.

#### Store Structure

```typescript
// libs/data-access/notes/src/notes.store.types.ts
interface NotesState {
  notes: Note[];
  searchQuery: string;
}

interface NotesActions {
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, input: UpdateNoteInput) => boolean;
  deleteNote: (id: string) => boolean;
  getNote: (id: string) => Note | undefined;
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
}

type NotesStore = NotesState & NotesActions;
```

#### Runtime Validation with Zod

All store operations validate inputs using Zod schemas to ensure data integrity:

```typescript
// libs/data-access/notes/src/note.types.ts
export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  content: z.string(),
  createdAt: z.number().int().positive(),
  updatedAt: z.number().int().positive(),
});

export const CreateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string(),
});
```

#### Persistence

Notes are automatically persisted to `localStorage` using Zustand's `persist` middleware.

---

## Real-time Collaboration

### CRDT (Conflict-free Replicated Data Types)

We use [Yjs](https://yjs.dev/) for conflict-free resolution.

#### Implementation Details

1. Each note has a `Y.Doc` (Yjs document) that tracks all changes.
2. The `Y.XmlFragment` type is used for rich text (compatible with Tiptap/ProseMirror).

```typescript
// apps/notes/src/providers/YjsProvider.tsx
const getYDoc = (noteId: string): Y.Doc => {
  let doc = docsRef.current.get(noteId);
  if (!doc) {
    doc = new Y.Doc();
    docsRef.current.set(noteId, doc);

    // Persist to IndexedDB (offline support)
    new IndexeddbPersistence(`note-${noteId}`, doc);

    // Setup WebRTC provider for remote collaboration
    const provider = new WebrtcProvider(
      `${COLLAB_CONFIG.ROOM_PREFIX}-${noteId}`,
      doc,
      {
        signaling: [...COLLAB_CONFIG.SIGNALING_SERVERS],
      }
    );
    providersRef.current.set(noteId, provider);
  }
  return doc;
};
```

### Synchronization Methods

- **Local (Cross-Tab)**: Uses `BroadcastChannel` API.
- **Remote (Peer-to-Peer)**: Uses WebRTC with signaling servers.

### Collaborative Cursors

Users see each other's cursor positions and selections in real-time via `provider.awareness`.

---

## Rich Text Editor

### Tiptap + ProseMirror

[Tiptap](https://tiptap.dev/) is used as the headless rich text editor.

#### Extensions Used

- `StarterKit`: Basic formatting.
- `Underline`: Underline text formatting.
- `Collaboration`: Yjs integration.
- `Placeholder`: Show placeholder text when empty.

```typescript
// apps/notes/src/components/editor/useEditorExtensions.ts
export function useEditorExtensions(
  yXmlFragment: Y.XmlFragment,
  provider: WebrtcProvider
) {
  return useMemo(
    () => [
      StarterKit.configure({ history: false }), // Yjs handles undo/redo
      UnderlineExtension,
      Collaboration.configure({ fragment: yXmlFragment }),
      CollaborationCursor.configure({ provider, user: currentUser }),
      Placeholder.configure({ placeholder: PLACEHOLDERS.EDITOR }),
    ],
    [yXmlFragment, provider, currentUser]
  );
}
```

---

## Performance Optimizations

### 1. Memoization

Components are memoized (`React.memo`) to prevent unnecessary re-renders. Callbacks are wrapped in `useCallback`.

### 2. Debouncing

Search and auto-save use debouncing to reduce unnecessary operations.

### 3. Text Processing

- **HTML Entity Decoding**: Custom utility to handle HTML entities safely.
- **Word-Boundary Truncation**: Prevents cutting words mid-way when creating previews.
- **Unicode Normalization**: Search is accent-insensitive using NFD normalization.

---

## Testing Collaboration

### Local Collaboration (Multiple Tabs)

1. Open the app in your browser.
2. Create or select a note.
3. Open the same URL in another browser tab.
4. Edit the note in both tabs simultaneously.
5. Watch changes sync in real-time via BroadcastChannel API.

### Peer-to-Peer Collaboration (Multiple Users)

1. Open the app in your browser.
2. Create or select a note.
3. Share the note URL with another user (same network or internet).
4. Both users can edit simultaneously.
5. Changes sync via WebRTC signaling servers.
