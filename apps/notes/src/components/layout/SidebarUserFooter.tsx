import { ThemeToggle } from '@knowtis/design-system';
import { User } from 'lucide-react';

/**
 * Sidebar user footer props interface
 * @property {string} username - The username to display
 */
interface SidebarUserFooterProps {
  username?: string;
}

export function SidebarUserFooter({
  username = 'Demo User',
}: SidebarUserFooterProps) {
  return (
    <div className="p-4 border-t border-border/40 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden cursor-default">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-4 w-4" />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-foreground truncate">
            {username}
          </span>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
}
