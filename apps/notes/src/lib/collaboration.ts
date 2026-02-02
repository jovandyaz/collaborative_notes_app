import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

import { COLLAB_CONFIG } from './collaboration.constants';

const INSTANCE_ID = crypto.randomUUID();

export function getInstanceId(): string {
  return INSTANCE_ID;
}

export function getRandomCursorColor(): string {
  const { CURSOR_COLORS } = COLLAB_CONFIG;
  const randomIndex = Math.floor(Math.random() * CURSOR_COLORS.length);
  return CURSOR_COLORS[randomIndex];
}

export function generateUserName(userId: string): string {
  if (!userId || userId.length === 0) {
    console.warn('Empty userId provided, using fallback');
    return 'Anonymous User';
  }

  let seed = 0;
  for (let i = 0; i < userId.length; i++) {
    seed = (seed * 31 + userId.charCodeAt(i)) >>> 0;
  }

  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    style: 'capital',
    seed,
  });
}

export function clampPosition(position: number, maxSize: number): number {
  if (maxSize < 0) {
    console.warn('maxSize is negative, returning 0');
    return 0;
  }

  return Math.min(Math.max(0, position), maxSize);
}

export function isInvalidStateError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'InvalidStateError';
}
