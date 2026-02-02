import { err, ok, type Result } from 'neverthrow';

import { NoteErrors, type NoteDomainError } from '../errors';

export class NoteContent {
  private constructor(public readonly value: string) {}

  static create(content: string): Result<NoteContent, NoteDomainError> {
    if (content === undefined || content === null) {
      return err(
        NoteErrors.invalidContent('Content cannot be null or undefined')
      );
    }

    return ok(new NoteContent(content));
  }

  toPrimitive(): string {
    return this.value;
  }
}
