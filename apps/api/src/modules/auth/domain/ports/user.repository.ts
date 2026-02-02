import type { Result } from 'neverthrow';

import type { AuthDomainError } from '../errors';
import type { Email, UserId } from '../value-objects';

export interface UserEntity {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl: string | null;
  readonly passwordHash: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateUserData {
  readonly email: string;
  readonly name: string;
  readonly passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: Email): Promise<UserEntity | null>;
  findById(id: UserId): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<Result<UserEntity, AuthDomainError>>;
  emailExists(email: Email): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
