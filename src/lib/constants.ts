/**
 * Application-wide constants
 */

// Storage keys for localStorage/IndexedDB
export const STORAGE_KEYS = {
  NOTES: 'collaborative-notes-app:notes',
  THEME: 'collaborative-notes-app:theme',
  USER_ID: 'collaborative-notes-app:user-id',
} as const;

// Debounce delays in milliseconds
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  AUTO_SAVE: 500,
} as const;

// Editor configuration
export const EDITOR_CONFIG = {
  PLACEHOLDER: 'Start writing your note...',
  MIN_HEIGHT: 200,
} as const;

// Collaboration configuration
export const COLLAB_CONFIG = {
  // Broadcast channel name for cross-tab sync
  CHANNEL_NAME: 'collaborative-notes-sync',
  // Colors for collaborative cursors
  CURSOR_COLORS: [
    '#f87171', // red
    '#fb923c', // orange
    '#facc15', // yellow
    '#4ade80', // green
    '#22d3ee', // cyan
    '#818cf8', // indigo
    '#c084fc', // purple
    '#f472b6', // pink
  ],
} as const;

