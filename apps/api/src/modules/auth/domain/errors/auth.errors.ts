export interface AuthDomainError {
  readonly code: string;
  readonly message: string;
}

export const AuthErrorCodes = {
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  INVALID_USER_ID: 'INVALID_USER_ID',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type AuthErrorCode =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];

export function createAuthError(
  code: AuthErrorCode,
  message: string
): AuthDomainError {
  return { code, message };
}

export const AuthErrors = {
  invalidEmail: (email: string) =>
    createAuthError(
      AuthErrorCodes.INVALID_EMAIL,
      `Invalid email format: ${email}`
    ),

  invalidPassword: () =>
    createAuthError(AuthErrorCodes.INVALID_PASSWORD, 'Invalid password'),

  invalidUserId: (reason: string) =>
    createAuthError(
      AuthErrorCodes.INVALID_USER_ID,
      `Invalid user ID: ${reason}`
    ),

  weakPassword: () =>
    createAuthError(
      AuthErrorCodes.WEAK_PASSWORD,
      'Password must be at least 8 characters'
    ),

  emailAlreadyExists: (email: string) =>
    createAuthError(
      AuthErrorCodes.EMAIL_ALREADY_EXISTS,
      `Email already registered: ${email}`
    ),

  userNotFound: (identifier: string) =>
    createAuthError(
      AuthErrorCodes.USER_NOT_FOUND,
      `User not found: ${identifier}`
    ),

  invalidCredentials: () =>
    createAuthError(AuthErrorCodes.INVALID_CREDENTIALS, 'Invalid credentials'),

  invalidRefreshToken: () =>
    createAuthError(
      AuthErrorCodes.INVALID_REFRESH_TOKEN,
      'Invalid refresh token'
    ),

  internalError: (message: string) =>
    createAuthError(AuthErrorCodes.INTERNAL_ERROR, message),
} as const;
