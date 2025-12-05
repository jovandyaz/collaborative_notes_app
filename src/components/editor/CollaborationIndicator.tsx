import { Users } from 'lucide-react';

import { cn } from '@/lib';
import type { CollaborativeUser } from '@/types';

interface CollaborationIndicatorProps {
  users: CollaborativeUser[];
}

/**
 * Indicator showing other users currently editing the note
 */
export function CollaborationIndicator({ users }: CollaborationIndicatorProps) {
  if (users.length === 0) return null;

  return (
    <div className="mb-2 flex items-center gap-2 rounded-lg bg-[var(--primary)]/10 px-3 py-2">
      <Users className="h-4 w-4 text-[var(--primary)]" />
      <span className="text-sm text-[var(--primary)]">
        {users.length} other {users.length === 1 ? 'user' : 'users'} editing
      </span>
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--card)] text-xs font-medium text-white'
            )}
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 5 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--card)] bg-[var(--muted)] text-xs font-medium text-[var(--muted-foreground)]">
            +{users.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
