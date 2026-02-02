export interface DomainEvent {
  readonly id: string;
  readonly occurredOn: Date;
  readonly aggregateId: string;
  readonly name: string;
}
