import { Link } from '@tanstack/react-router';

import { FileText } from 'lucide-react';

/**
 * Sidebar brand props interface
 * @property {() => void} onClick - The function to call when the brand is clicked
 */
interface SidebarBrandProps {
  onClick?: () => void;
}

export function SidebarBrand({ onClick }: SidebarBrandProps) {
  return (
    <div className="flex h-16 items-center px-6 border-b border-border/40">
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-foreground hover:opacity-80 transition-opacity cursor-pointer"
        onClick={onClick}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <FileText className="h-4 w-4" />
        </div>
        <span>knowtis</span>
      </Link>
    </div>
  );
}
