import { err, ok, type Result } from 'neverthrow';

import { NoteErrors, type NoteDomainError } from '../errors';

export type PermissionType = 'viewer' | 'editor';

export class PermissionLevel {
  private constructor(public readonly value: PermissionType) {}

  static create(level: string): Result<PermissionLevel, NoteDomainError> {
    if (level !== 'viewer' && level !== 'editor') {
      return err(NoteErrors.invalidPermission());
    }

    return ok(new PermissionLevel(level as PermissionType));
  }

  isEditor(): boolean {
    return this.value === 'editor';
  }
}
