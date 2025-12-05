import { createFileRoute } from '@tanstack/react-router';

import { lazy, Suspense } from 'react';

import { Loader2 } from 'lucide-react';

// Lazy load HomePage for code splitting
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage }))
);

/**
 * Home route - displays the list of notes
 * Uses lazy loading for better initial load performance
 */
export const Route = createFileRoute('/')({
  component: HomePageWrapper,
});

function HomePageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomePage />
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
