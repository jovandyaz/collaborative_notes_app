import { createFileRoute } from '@tanstack/react-router';

import { lazy, Suspense } from 'react';

import { Loader2 } from 'lucide-react';

// Lazy load NoteEditorPage for code splitting
const NoteEditorPage = lazy(() =>
  import('@/pages/NoteEditorPage').then((m) => ({ default: m.NoteEditorPage }))
);

/**
 * Note editor route - displays the rich text editor for a specific note
 * Uses lazy loading for better performance
 */
export const Route = createFileRoute('/notes/$noteId')({
  component: NoteEditorPageWrapper,
});

function NoteEditorPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NoteEditorPage />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
    </div>
  );
}
