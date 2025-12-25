import type { LinkProps } from '@tanstack/react-router';

import type { LucideIcon } from 'lucide-react';
import { Home } from 'lucide-react';

import type { FileRouteTypes } from '../routeTree.gen';

/**
 * Type-safe navigation link configuration
 * @property {LucideIcon} icon - The icon to display
 * @property {string} label - The label to display
 * @property {FileRouteTypes['to']} to - The route to navigate to
 * @property {Omit<LinkProps, 'to' | 'children'>} linkProps - Additional link props
 */
export interface NavigationLink {
  icon: LucideIcon;
  label: string;
  to: FileRouteTypes['to'];
  linkProps?: Omit<LinkProps, 'to' | 'children'>;
}

/**
 * Main navigation links configuration
 */
export const NAVIGATION_LINKS: NavigationLink[] = [
  {
    icon: Home,
    label: 'Home',
    to: '/',
  },
] as const satisfies NavigationLink[];
