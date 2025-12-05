import { Suspense, lazy } from 'react';

import { createFileRoute } from '@tanstack/react-router';

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

//TODO: could it be a utility function?
function NoteEditorPageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NoteEditorPage />
    </Suspense>
  );
}

//TODO: move to components folder
function LoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
    </div>
  );
}
