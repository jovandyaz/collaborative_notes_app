import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class NoteNotFoundException extends NotFoundException {
  constructor(noteId: string) {
    super({
      message: `Note with id "${noteId}" not found`,
      error: 'NoteNotFound',
      noteId,
    });
  }
}

export class NoteAccessDeniedException extends ForbiddenException {
  constructor(noteId?: string) {
    super({
      message: 'You do not have access to this note',
      error: 'NoteAccessDenied',
      noteId,
    });
  }
}

export class NoteEditDeniedException extends ForbiddenException {
  constructor(noteId?: string) {
    super({
      message: 'You do not have permission to edit this note',
      error: 'NoteEditDenied',
      noteId,
    });
  }
}

export class NoteDeleteDeniedException extends ForbiddenException {
  constructor(noteId?: string) {
    super({
      message: 'Only the owner can delete this note',
      error: 'NoteDeleteDenied',
      noteId,
    });
  }
}

export class NoteShareDeniedException extends ForbiddenException {
  constructor(noteId?: string) {
    super({
      message: 'Only the owner can share this note',
      error: 'NoteShareDenied',
      noteId,
    });
  }
}

export class PermissionNotFoundException extends NotFoundException {
  constructor(noteId: string, userId: string) {
    super({
      message: 'Permission not found',
      error: 'PermissionNotFound',
      noteId,
      userId,
    });
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(identifier: string) {
    super({
      message: `User "${identifier}" not found`,
      error: 'UserNotFound',
    });
  }
}

export class UserAlreadyExistsException extends ForbiddenException {
  constructor(email: string) {
    super({
      message: `User with email "${email}" already exists`,
      error: 'UserAlreadyExists',
    });
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      message: 'Invalid email or password',
      error: 'InvalidCredentials',
    });
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor(tokenType: 'access' | 'refresh' = 'access') {
    super({
      message: `Invalid or expired ${tokenType} token`,
      error: 'InvalidToken',
      tokenType,
    });
  }
}

export class CollaborationRoomNotFoundException extends NotFoundException {
  constructor(noteId: string) {
    super({
      message: `Collaboration room for note "${noteId}" not found`,
      error: 'CollaborationRoomNotFound',
      noteId,
    });
  }
}

export class AnonymousAccessDeniedException extends ForbiddenException {
  constructor() {
    super({
      message:
        'Anonymous users can only access public notes. Please sign in to access this note.',
      error: 'AnonymousAccessDenied',
    });
  }
}
