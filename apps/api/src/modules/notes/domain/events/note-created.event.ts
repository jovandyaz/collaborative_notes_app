import { randomUUID } from 'crypto';

import { DomainEvent } from '../../../../core/domain/events/domain-event.interface';

export class NoteCreatedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'note.created';
  readonly name = NoteCreatedEvent.EVENT_NAME;
  readonly id: string;
  readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly title: string,
    public readonly ownerId: string
  ) {
    this.id = randomUUID();
    this.occurredOn = new Date();
  }
}
