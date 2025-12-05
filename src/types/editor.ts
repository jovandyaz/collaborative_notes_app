/**
 * Editor-related types for the rich text editor
 */

/**
 * Available text formatting options
 */
export type TextFormat = 'bold' | 'italic' | 'underline';

/**
 * Available list types
 */
export type ListType = 'bulletList' | 'orderedList';

/**
 * Toolbar action types
 */
export type ToolbarAction = TextFormat | ListType | 'undo' | 'redo';

/**
 * Collaborative user representation
 */
export interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
}

/**
 * Editor state for collaboration awareness
 */
export interface EditorAwareness {
  user: CollaborativeUser;
  cursor: {
    anchor: number;
    head: number;
  } | null;
}

