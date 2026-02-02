/**
 * Authentication types shared between frontend and backend
 */

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
  };
  tokens: AuthTokens;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export type OAuthProvider = 'google' | 'github';

/**
 * JWT payload structure for authenticated users
 * Used by both frontend and backend for type-safe token handling
 */
export interface JwtUserPayload {
  /** User ID (subject) */
  sub: string;
  /** User email */
  email: string;
  /** Token issued at timestamp */
  iat?: number;
  /** Token expiration timestamp */
  exp?: number;
}

/**
 * User object attached to requests after JWT validation
 * Used by controllers to access the authenticated user's information
 */
export interface RequestUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}
