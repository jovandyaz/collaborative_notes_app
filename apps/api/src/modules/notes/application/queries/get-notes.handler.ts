import { Inject, Injectable } from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';

import { UserId } from '../../../auth/domain';
import {
  NOTE_REPOSITORY,
  type NoteDomainError,
  type NoteEntity,
  type NoteRepository,
} from '../../domain';

export interface GetNotesInput {
  readonly userId: string;
  readonly search?: string;
}

export type AccessibleNote = NoteEntity & {
  accessLevel: 'owner' | 'editor' | 'viewer';
};

@Injectable()
export class GetNotesHandler {
  constructor(
    @Inject(NOTE_REPOSITORY) private readonly noteRepository: NoteRepository
  ) {}

  async execute(
    input: GetNotesInput
  ): Promise<Result<AccessibleNote[], NoteDomainError>> {
    const userIdResult = UserId.create(input.userId);
    if (userIdResult.isErr()) {
      return err(userIdResult.error as NoteDomainError);
    }

    const results = await this.noteRepository.findAccessibleByUser(
      userIdResult.value,
      input.search
    );

    const accessibleNotes = results.map(({ note, permission }) => ({
      ...note,
      accessLevel: (note.ownerId === input.userId
        ? 'owner'
        : (permission ?? 'viewer')) as 'owner' | 'editor' | 'viewer',
    }));

    return ok(accessibleNotes);
  }
}
