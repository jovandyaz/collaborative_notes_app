/**
 * Note entity types shared between frontend and backend
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteWithOwner extends Note {
  owner: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateNoteInput {
  title: string;
  content?: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
  isPublic?: boolean;
}

export type PermissionLevel = 'viewer' | 'editor';

export interface NotePermission {
  id: string;
  noteId: string;
  userId: string;
  permission: PermissionLevel;
  createdAt: Date;
}

export interface ShareNoteInput {
  userId: string;
  permission: PermissionLevel;
}
