import { err, ok, type Result } from 'neverthrow';

import { AuthErrors, type AuthDomainError } from '../errors';

const MIN_PASSWORD_LENGTH = 8;

export class Password {
  private constructor(public readonly value: string) {}

  static create(password: string): Result<Password, AuthDomainError> {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return err(AuthErrors.weakPassword());
    }

    return ok(new Password(password));
  }

  static fromHashed(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }
}
