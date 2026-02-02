# Notes App

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
</p>

**The Notes App** is a modern, real-time collaborative notes application built with React 19. It features rich text editing, live collaboration, and offline support.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [Real-time Collaboration](#real-time-collaboration)
- [Testing](#testing)
- [Building for Production](#building-for-production)

---

## Features

| Feature              | Description                                    |
| -------------------- | ---------------------------------------------- |
| 🔐 Authentication    | Login, register, and protected routes with JWT |
| 📝 Rich Text Editor  | Tiptap-based editor with formatting toolbar    |
| 🔄 Real-time Sync    | CRDT-based collaboration using Yjs             |
| 👥 Live Presence     | See collaborators' cursors and selections      |
| 📱 Responsive Design | Mobile-first, works on all devices             |
| 🌙 Dark Mode         | System-aware theme switching                   |
| 💾 Offline Support   | IndexedDB persistence for offline editing      |
| ⚡ Fast Performance  | Optimized with React 19 and Vite               |

---

## Quick Start

### Prerequisites

Ensure the backend API is running. See the [root README](../../README.md) for full setup instructions.

### Development

```bash
# From workspace root
pnpm dev

# Or using Nx directly
nx serve notes
```

The app will be available at **http://localhost:4200**

### With Backend

```bash
# Start everything
pnpm docker:up    # Database
pnpm dev:all      # API + Notes app
```

---

## Project Structure

```
apps/notes/
├── src/
│   ├── components/           # UI components
│   │   ├── auth/            # Auth-related components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── editor/          # Rich text editor
│   │   │   ├── NoteEditor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   └── useEditorExtensions.ts
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── notes/           # Notes list & cards
│   │       ├── NoteCard.tsx
│   │       └── NoteList.tsx
│   │
│   ├── pages/               # Page components
│   │   ├── HomePage.tsx     # Notes dashboard
│   │   ├── LoginPage.tsx    # Login form
│   │   ├── RegisterPage.tsx # Registration form
│   │   └── NoteEditorPage.tsx # Note editing
│   │
│   ├── routes/              # TanStack Router routes
│   │   ├── __root.tsx       # Root layout
│   │   ├── index.tsx        # Home route
│   │   ├── login.tsx        # Login route
│   │   ├── register.tsx     # Register route
│   │   └── notes.$noteId.tsx # Note editor route
│   │
│   ├── providers/           # React context providers
│   │   ├── AppProviders.tsx # Provider composition
│   │   ├── AuthProvider.tsx # Authentication context
│   │   ├── QueryProvider.tsx # React Query setup
│   │   ├── ThemeProvider.tsx # Theme management
│   │   └── YjsProvider.tsx  # Yjs collaboration
│   │
│   ├── hooks/               # App-specific hooks
│   │   ├── useActiveCollaborators.ts
│   │   └── useAutoSave.ts
│   │
│   ├── stores/              # App-level Zustand stores
│   │   └── ui.store.ts
│   │
│   ├── lib/                 # Utilities
│   │   ├── date.ts          # Date formatting
│   │   └── text.ts          # Text utilities
│   │
│   ├── config/              # App configuration
│   │   └── constants.ts
│   │
│   └── types/               # TypeScript types
│       └── editor.ts
│
├── public/                  # Static assets
├── index.html               # Entry HTML
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Test configuration
└── tsconfig.json            # TypeScript config
```

---

## Configuration

### Environment Variables

Create a `.env` file in `apps/notes/`:

```env
# API Configuration
VITE_API_URL=http://localhost:3333/api
VITE_WS_URL=http://localhost:3333

# Collaboration Mode
# Options: 'webrtc' | 'websocket' | 'hybrid'
#
# - webrtc:    P2P only, works offline (no backend needed)
# - websocket: Server-based only (requires API)
# - hybrid:    WebSocket primary, WebRTC fallback
VITE_COLLABORATION_MODE=websocket
```

### Collaboration Modes

| Mode        | Backend Required | Offline | Description                       |
| ----------- | ---------------- | ------- | --------------------------------- |
| `webrtc`    | No               | Yes     | Peer-to-peer via WebRTC signaling |
| `websocket` | Yes              | No      | Server-based sync via Socket.io   |
| `hybrid`    | Optional         | Yes     | WebSocket with WebRTC fallback    |

---

## Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      NestJS Application                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Controllers                          │  │
│  │  • AuthController (HTTP -> Command/Query)             │  │
│  │  • NotesController (HTTP -> Command/Query)            │  │
│  │  • CollaborationGateway (WebSocket)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Application Layer                      │  │
│  │  • Command Handlers (CreateNote, etc.)                │  │
│  │  • Query Handlers (GetNote, etc.)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Domain Layer                         │  │
│  │  • Entities (Note, User)                              │  │
│  │  • Ports (start repositories)                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Infrastructure Layer                     │  │
│  │  • DrizzleNoteRepository                              │  │
│  │  • Database (PostgreSQL)                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
<App>
  └── <AppProviders>
        ├── <QueryClientProvider>    # React Query
        ├── <ThemeProvider>          # Dark/light mode
        ├── <AuthProvider>           # Auth state
        └── <YjsProvider>            # Collaboration
              └── <RouterProvider>
                    └── <RootLayout>
                          ├── <Header />
                          └── <Outlet />
                                ├── <HomePage />
                                ├── <LoginPage />
                                ├── <RegisterPage />
                                └── <NoteEditorPage />
```

### Data Flow

```
User Action
    ↓
Page/Component
    ↓
Custom Hook (useNotes, useLogin, etc.)
    ↓
├── React Query (API calls via @knowtis/api-client)
└── Zustand Store (local state via @knowtis/data-access)
    ↓
API Response / State Update
    ↓
Component Re-render
```

---

## Components

### Pages

| Page             | Route        | Auth Required | Description           |
| ---------------- | ------------ | ------------- | --------------------- |
| `HomePage`       | `/`          | Yes           | Notes dashboard       |
| `LoginPage`      | `/login`     | No            | User login form       |
| `RegisterPage`   | `/register`  | No            | User registration     |
| `NoteEditorPage` | `/notes/:id` | Yes           | Rich text note editor |

### Key Components

#### `ProtectedRoute`

Wraps routes that require authentication. Redirects to `/login` if user is not authenticated.

```tsx
<ProtectedRoute>
  <HomePage />
</ProtectedRoute>
```

#### `NoteEditor`

Rich text editor powered by Tiptap with collaboration support.

```tsx
<NoteEditor
  noteId={noteId}
  yDoc={yDoc}
  provider={provider}
  onSave={handleSave}
/>
```

#### `EditorToolbar`

Formatting toolbar for the rich text editor.

```tsx
<EditorToolbar editor={editor} />
```

---

## State Management

### Zustand Stores

We use [Zustand](https://github.com/pmndrs/zustand) for state management across the application.

#### Notes Store (`@knowtis/data-access-notes`)

```typescript
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
```

#### Auth Store (`@knowtis/data-access-auth`)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
  register: (input: RegisterInput) => Promise<void>;
  refreshToken: () => Promise<void>;
}
```

### React Query

Server state is managed with [TanStack Query](https://tanstack.com/query):

```typescript
// Hooks provided by @knowtis/data-access-auth
import { useLogin, useProfile, useRegister } from '@knowtis/data-access-auth';
// Hooks provided by @knowtis/data-access-notes
import {
  useCreateNote,
  useDeleteNote,
  useNote,
  useNotes,
  useUpdateNote,
} from '@knowtis/data-access-notes';
```

---

## Real-time Collaboration

### Technology Stack

| Technology | Purpose                                     |
| ---------- | ------------------------------------------- |
| Yjs        | CRDT for conflict-free data synchronization |
| Tiptap     | Rich text editor with Yjs integration       |
| Socket.io  | WebSocket transport for server sync         |
| WebRTC     | Peer-to-peer transport for offline mode     |
| IndexedDB  | Local persistence for offline support       |

### How It Works

1. **Document Creation**: Each note has a `Y.Doc` (Yjs document)
2. **Content Storage**: Text stored as `Y.XmlFragment` (ProseMirror compatible)
3. **Synchronization**:
   - Changes broadcast via WebSocket or WebRTC
   - Conflicts resolved automatically by CRDT algorithm
4. **Persistence**:
   - Remote: Saved to PostgreSQL via API
   - Local: Cached in IndexedDB

### Awareness (Live Presence)

Collaborators see each other's:

- Cursor positions
- Text selections
- User info (name, avatar, color)

```typescript
// In YjsProvider
provider.awareness.setLocalStateField('user', {
  name: currentUser.name,
  color: userColor,
  cursor: cursorPosition,
});
```

### Testing Collaboration

#### Local (Multiple Tabs)

1. Open the app in your browser
2. Create or select a note
3. Open the same URL in another tab
4. Edit in both tabs simultaneously
5. Changes sync in real-time via BroadcastChannel

#### Remote (Multiple Users)

1. Share the note URL with another user
2. Both users can edit simultaneously
3. Changes sync via WebSocket server

---

## Testing

### Running Tests

```bash
# Watch mode
nx test notes

# Single run
nx test notes --run

# With coverage
nx test notes --coverage

# Specific file
nx test notes --testPathPattern=NoteCard
```

### Test Structure

```
src/
├── components/
│   └── notes/
│       ├── NoteCard.tsx
│       └── NoteCard.test.tsx     # Component test
├── hooks/
│   └── useAutoSave.ts
│       └── useAutoSave.test.ts   # Hook test
└── test/
    └── setup.ts                  # Test setup
```

### Testing Libraries

- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

---

## Building for Production

### Build Command

```bash
# From workspace root
pnpm build

# Or directly
nx build notes
```

### Output

Build artifacts are generated in `dist/apps/notes/`:

```
dist/apps/notes/
├── index.html
├── assets/
│   ├── index.[hash].js
│   └── index.[hash].css
└── ...
```

### Preview Production Build

```bash
pnpm preview
# or
nx preview notes
```

### Deployment

The built app is a static site that can be deployed to:

- **Vercel** (configured via `vercel.json`)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting**

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Environment Variables for Production

Set these in your hosting provider:

```env
VITE_API_URL=https://api.your-domain.com/api
VITE_WS_URL=https://api.your-domain.com
VITE_COLLABORATION_MODE=websocket
```

---

## Related Documentation

- [Root README](../../README.md) - Workspace overview
- [API Documentation](../api/README.md) - Backend API
- [Architecture Guide](../../docs/ARCHITECTURE.md) - System design
- [API Client](../../libs/api-client/README.md) - HTTP client library

---

<p align="center">
  Part of the <strong>Knowtis</strong> monorepo
</p>
