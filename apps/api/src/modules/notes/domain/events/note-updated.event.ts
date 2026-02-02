import { randomUUID } from 'crypto';

import { DomainEvent } from '../../../../core/domain/events/domain-event.interface';

export class NoteUpdatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'note.updated';
  readonly name = NoteUpdatedEvent.EVENT_NAME;
  readonly id: string;
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly updates: {
      title?: string;
      content?: string;
      isPublic?: boolean;
    },
    public readonly performedBy: string
  ) {
    this.id = randomUUID();
    this.occurredOn = new Date();
  }
}
