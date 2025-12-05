# Notis App

<!-- TODO: improve it -->

A real-time collaborative notes application built with React 19, TypeScript, and modern tooling. This app handles concurrent edits efficiently using CRDT (Conflict-free Replicated Data Types).

<!-- TODO: check if these are the lastest stable versions -->

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)

## Features

- **Create, Edit & Delete Notes**: Full CRUD operations with persistent storage
- **Rich Text Editor**: Bold, italic, underline, bullet lists, and numbered lists
- **Real-time Collaboration**: Multiple browser tabs can edit the same note simultaneously
- **Conflict Resolution**: Automatic merge using Yjs CRDT - no data loss
- **Auto-save**: Changes are saved automatically with debounce
- **Search**: Filter notes by title or content
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

| Category         | Technology               |
| ---------------- | ------------------------ |
| Framework        | React 19 + TypeScript    |
| Build Tool       | Vite 7                   |
| Routing          | TanStack Router          |
| State Management | Zustand                  |
| Rich Text Editor | Tiptap (ProseMirror)     |
| Real-time Sync   | Yjs (CRDT)               |
| Styling          | Tailwind CSS 4           |
| Testing          | Vitest + Testing Library |

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn

## Setup Instructions

### 1. Clone the repository

<!-- TODO: Should we rename the repo? -->

```bash
git clone https://github.com/jovandyaz/collaborative_notes_app.git
cd collaborative_notes_app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### 4. Test real-time collaboration

1. Open the app in your browser
2. Create or select a note
3. Open the same URL in another browser tab
4. Edit the note in both tabs simultaneously
5. Watch changes sync in real-time!

## Project Structure

<!-- TODO: udpate this part only with the most important files -->

```bash
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Dialog, etc.)
│   ├── layout/          # Layout components (Header, Layout)
│   ├── notes/           # Note-specific components (NoteCard, NoteList)
│   └── editor/          # Editor components (RichTextEditor, Toolbar)
├── features/
│   └── notes/           # Note feature logic (useFilteredNotes)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, constants, helpers
├── pages/               # Page components
├── providers/           # Context providers (YjsProvider)
├── routes/              # TanStack Router route definitions
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
└── test/                # Test setup files
```

## Testing

Run the test suite:

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```
