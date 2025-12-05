import type { ReactNode } from 'react';

import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps all pages
 * Uses a Sidebar layout with a responsive main content area
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />

      {/* Main Content Area */}
      {/* Added md:pl-64 to push content to the right of the sidebar on desktop */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:pl-64">
        {/* Top spacer for mobile (hamburger menu overlap) */}
        <div className="h-16 md:hidden" />

        <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
