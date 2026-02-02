export interface NoteDomainError {
  readonly code: string;
  readonly message: string;
}

export const NoteErrorCodes = {
  INVALID_TITLE: 'INVALID_TITLE',
  INVALID_CONTENT: 'INVALID_CONTENT',
  INVALID_PERMISSION: 'INVALID_PERMISSION',
  NOTE_NOT_FOUND: 'NOTE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

export type NoteErrorCode =
  (typeof NoteErrorCodes)[keyof typeof NoteErrorCodes];

export function createNoteError(
  code: NoteErrorCode,
  message: string
): NoteDomainError {
  return { code, message };
}

export const NoteErrors = {
  invalidTitle: (reason: string) =>
    createNoteError(NoteErrorCodes.INVALID_TITLE, `Invalid title: ${reason}`),

  invalidContent: (reason: string) =>
    createNoteError(
      NoteErrorCodes.INVALID_CONTENT,
      `Invalid content: ${reason}`
    ),

  invalidPermission: () =>
    createNoteError(
      NoteErrorCodes.INVALID_PERMISSION,
      'Invalid permission level'
    ),

  noteNotFound: (id: string) =>
    createNoteError(NoteErrorCodes.NOTE_NOT_FOUND, `Note not found: ${id}`),

  permissionDenied: (message = 'Permission denied') =>
    createNoteError(NoteErrorCodes.PERMISSION_DENIED, message),
} as const;
