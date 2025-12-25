import { Link } from '@tanstack/react-router';

import type { NavigationLink } from '@/config/navigation.config';

/**
 * Navigation links props interface
 * @property {NavigationLink[]} links - The links to display
 * @property {() => void} onLinkClick - The function to call when a link is clicked
 */
interface NavigationLinksProps {
  links: NavigationLink[];
  onLinkClick?: () => void;
}

export function NavigationLinks({ links, onLinkClick }: NavigationLinksProps) {
  return (
    <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onLinkClick}
          activeProps={{
            className: 'bg-muted text-foreground',
          }}
          inactiveProps={{
            className:
              'text-muted-foreground hover:bg-primary/5 hover:text-primary',
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer"
          {...link.linkProps}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
