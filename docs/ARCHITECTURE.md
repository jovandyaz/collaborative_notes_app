# Architecture & Technical Concepts

This document explains the key architectural decisions and technical concepts implemented in Notis.

## Table of Contents

1. [Overview](#overview)
2. [State Management](#state-management)
3. [Real-time Collaboration](#real-time-collaboration)
4. [Rich Text Editor](#rich-text-editor)
5. [Performance Optimizations](#performance-optimizations)
6. [Testing Strategy](#testing-strategy)
7. [Design Patterns](#design-patterns)

---

## Overview

Notis is designed to demonstrate:

- **State Management**: Efficient handling of application state with Zustand
- **UI Responsiveness**: Optimized rendering with memoization and lazy loading
- **Concurrent Edit Handling**: CRDT-based conflict resolution with Yjs

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Tab 1                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   React UI  │──│   Zustand   │──│   Yjs Y.Doc         │  │
│  │  Components │  │    Store    │  │   (CRDT State)      │  │
│  └─────────────┘  └─────────────┘  └──────────┬──────────┘  │
│                                                │              │
└────────────────────────────────────────────────┼──────────────┘
                                                 │
                              ┌──────────────────┴──────────────────┐
                              │         BroadcastChannel API        │
                              │      (Cross-tab communication)      │
                              └──────────────────┬──────────────────┘
                                                 │
┌────────────────────────────────────────────────┼──────────────┐
│                        Browser Tab 2           │              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┴──────────┐  │
│  │   React UI  │──│   Zustand   │──│   Yjs Y.Doc         │  │
│  │  Components │  │    Store    │  │   (CRDT State)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## State Management

### Zustand Store

We use [Zustand](https://github.com/pmndrs/zustand) for global state management because:

- **Minimal boilerplate**: No actions, reducers, or providers needed
- **TypeScript-first**: Excellent type inference
- **Middleware support**: Built-in persistence to localStorage
- **Selective subscriptions**: Components only re-render when their slice changes

#### Store Structure

```typescript
// src/stores/notesStore.ts
interface NotesState {
  notes: Note[];
  searchQuery: string;
}

interface NotesActions {
  createNote: (input: CreateNoteInput) => Note;
  updateNote: (id: string, input: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  getNote: (id: string) => Note | undefined;
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
}
```

#### Persistence

Notes are automatically persisted to `localStorage` using Zustand's `persist` middleware:

```typescript
export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'collaborative-notes-app:notes',
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);
```

---

## Real-time Collaboration

### The Challenge of Concurrent Edits

When multiple users edit the same document simultaneously, conflicts can occur:

```
User A: "Hello World" → "Hello Beautiful World"
User B: "Hello World" → "Hello Brave World"

Without conflict resolution: Data loss or corruption
With CRDT: "Hello Beautiful Brave World" (automatic merge)
```

### CRDT (Conflict-free Replicated Data Types)

We use [Yjs](https://yjs.dev/), a high-performance CRDT implementation:

- **Eventual Consistency**: All replicas converge to the same state
- **No Central Server**: Works peer-to-peer
- **Automatic Conflict Resolution**: No manual merge needed

#### How It Works

1. Each note has a `Y.Doc` (Yjs document) that tracks all changes
2. Changes are represented as operations (insert, delete) with unique IDs
3. Operations can be applied in any order and still produce the same result
4. The `Y.XmlFragment` type is used for rich text (compatible with Tiptap)

```typescript
// src/providers/YjsProvider.tsx
const getYDoc = (noteId: string): Y.Doc => {
  let doc = docsRef.current.get(noteId);
  if (!doc) {
    doc = new Y.Doc();
    docsRef.current.set(noteId, doc);

    // Persist to IndexedDB
    new IndexeddbPersistence(`note-${noteId}`, doc);

    // Sync changes across tabs
    doc.on('update', (update) => {
      broadcastChannel.postMessage({ type: 'update', noteId, updates: update });
    });
  }
  return doc;
};
```

### Cross-Tab Synchronization

We use the [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) to sync changes between browser tabs:

```typescript
// Messages sent between tabs
type SyncMessage =
  | { type: 'update'; noteId: string; updates: Uint8Array }
  | { type: 'presence'; noteId: string; user: CollaborativeUser }
  | { type: 'leave'; noteId: string; user: CollaborativeUser };
```

This simulates real-time collaboration without requiring a WebSocket server.

---

## Rich Text Editor

### Tiptap + ProseMirror

[Tiptap](https://tiptap.dev/) is a headless rich text editor built on ProseMirror:

- **Extensible**: Add features via extensions
- **Yjs Integration**: Native support for collaborative editing
- **Framework-agnostic**: Works with React, Vue, or vanilla JS

#### Extensions Used

| Extension | Purpose |
|-----------|---------|
| `StarterKit` | Basic formatting (bold, italic, lists, etc.) |
| `Underline` | Underline text formatting |
| `Collaboration` | Yjs integration for real-time sync |

#### Editor Configuration

```typescript
// src/components/editor/CollaborativeEditor.tsx
const editor = useEditor({
  extensions: [
    StarterKit,
    UnderlineExtension,
    Collaboration.configure({
      fragment: yXmlFragment, // Yjs fragment for this note
    }),
  ],
  onUpdate: ({ editor }) => {
    onUpdate(editor.getHTML());
  },
});
```

---

## Performance Optimizations

### 1. Memoization

Components are memoized to prevent unnecessary re-renders:

```typescript
// src/components/notes/NoteCard.tsx
export const NoteCard = memo(function NoteCard({ note, onDelete }) {
  // Component only re-renders when note or onDelete changes
});
```

### 2. Debouncing

Search and auto-save use debouncing to reduce unnecessary operations:

```typescript
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. Lazy Loading

Routes are lazy-loaded to reduce initial bundle size:

```typescript
// src/routes/index.tsx
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage }))
);

export const Route = createFileRoute('/')({
  component: () => (
    <Suspense fallback={<LoadingFallback />}>
      <HomePage />
    </Suspense>
  ),
});
```

### 4. Selective Store Subscriptions

Zustand allows subscribing to specific state slices:

```typescript
// Only re-renders when notes change, not when searchQuery changes
const notes = useNotesStore((state) => state.notes);
```

---

## Testing Strategy

### Unit Tests

Test individual functions and hooks in isolation:

```typescript
// src/stores/notesStore.test.ts
describe('createNote', () => {
  it('should create a new note with title and content', () => {
    const { createNote, notes } = useNotesStore.getState();
    const newNote = createNote({ title: 'Test', content: '' });
    expect(newNote.title).toBe('Test');
  });
});
```

### Component Tests

Test UI components with React Testing Library:

```typescript
// src/components/ui/Button.test.tsx
it('should handle click events', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Test Coverage

| Area | Tests |
|------|-------|
| Notes Store | 11 tests (CRUD, filtering) |
| UI Components | 6 tests (Button variants) |
| Note Components | 5 tests (NoteCard rendering) |
| Hooks | 4 tests (useDebounce) |

---

## Design Patterns

### 1. Single Responsibility Principle

Each module has one reason to change:

- `notesStore.ts` - Note data management only
- `YjsProvider.tsx` - Collaboration logic only
- `NoteCard.tsx` - Note display only

### 2. Dependency Inversion

Components depend on abstractions (hooks, stores), not concretions:

```typescript
// Component doesn't know about localStorage implementation
const notes = useNotesStore((state) => state.notes);
```

### 3. Composition over Inheritance

UI is built by composing small, reusable components:

```typescript
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>
```

### 4. Provider Pattern

Context providers wrap the app to provide global functionality:

```typescript
// src/routes/__root.tsx
<YjsProvider>
  <Layout>
    <Outlet />
  </Layout>
</YjsProvider>
```

---

## Future Improvements

If this were a production app, consider:

1. **WebSocket Server**: Replace BroadcastChannel with WebSocket for true multi-user support
2. **Authentication**: Add user accounts and note ownership
3. **Note Sharing**: Generate shareable links for collaboration
4. **Offline Support**: Full PWA capabilities with service workers
5. **Note Categories**: Tags and folders for organization
6. **Export**: PDF and Markdown export options
