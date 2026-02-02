import { err, ok, type Result } from 'neverthrow';

import { NoteErrors, type NoteDomainError } from '../errors';

export class NoteTitle {
  private constructor(public readonly value: string) {}

  static create(title: string): Result<NoteTitle, NoteDomainError> {
    if (!title || title.trim().length === 0) {
      return err(NoteErrors.invalidTitle('Title cannot be empty'));
    }

    if (title.length > 200) {
      return err(NoteErrors.invalidTitle('Title cannot exceed 200 characters'));
    }

    return ok(new NoteTitle(title));
  }

  toPrimitive(): string {
    return this.value;
  }
}
