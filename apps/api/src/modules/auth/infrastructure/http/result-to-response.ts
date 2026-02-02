import { HttpException, HttpStatus } from '@nestjs/common';
import type { Result } from 'neverthrow';

import { AuthErrorCodes, type AuthDomainError } from '../../domain';

const ERROR_STATUS_MAP: Record<string, HttpStatus> = {
  [AuthErrorCodes.INVALID_EMAIL]: HttpStatus.BAD_REQUEST,
  [AuthErrorCodes.INVALID_PASSWORD]: HttpStatus.BAD_REQUEST,
  [AuthErrorCodes.WEAK_PASSWORD]: HttpStatus.BAD_REQUEST,
  [AuthErrorCodes.EMAIL_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [AuthErrorCodes.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [AuthErrorCodes.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [AuthErrorCodes.INVALID_REFRESH_TOKEN]: HttpStatus.UNAUTHORIZED,
};

export function unwrapOrThrow<T>(result: Result<T, AuthDomainError>): T {
  if (result.isErr()) {
    const status =
      ERROR_STATUS_MAP[result.error.code] ?? HttpStatus.BAD_REQUEST;
    throw new HttpException(
      {
        statusCode: status,
        error: result.error.code,
        message: result.error.message,
      },
      status
    );
  }
  return result.value;
}

export function handleResultError<T>(
  result: Result<T, AuthDomainError>
): result is Result<never, AuthDomainError> & { isErr(): true } {
  return result.isErr();
}
