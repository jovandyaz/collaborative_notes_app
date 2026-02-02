import { Inject, Injectable } from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';

import {
  NOTE_REPOSITORY,
  NoteErrors,
  type NoteDomainError,
  type NotePermissionEntity,
  type NoteRepository,
} from '../../domain';

export interface GetCollaboratorsInput {
  readonly noteId: string;
  readonly userId: string;
}

export interface CollaboratorInfo {
  permission: NotePermissionEntity;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

@Injectable()
export class GetCollaboratorsHandler {
  constructor(
    @Inject(NOTE_REPOSITORY) private readonly noteRepository: NoteRepository
  ) {}

  async execute(
    input: GetCollaboratorsInput
  ): Promise<Result<CollaboratorInfo[], NoteDomainError>> {
    const note = await this.noteRepository.findById(input.noteId);
    if (!note) {
      return err(NoteErrors.noteNotFound(input.noteId));
    }

    if (note.ownerId !== input.userId) {
      return err(
        NoteErrors.permissionDenied('Only owner can view collaborators')
      );
    }

    const collaborators = await this.noteRepository.findPermissionsByNote(
      input.noteId
    );
    return ok(collaborators);
  }
}
