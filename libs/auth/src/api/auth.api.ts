import { httpClient, tokenStorage } from '@knowtis/api-client';
import type {
  AuthResponse,
  AuthTokens,
  LoginInput,
  RegisterInput,
  UserProfile,
} from '@knowtis/shared-types';

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      '/auth/register',
      input,
      { skipAuth: true }
    );

    tokenStorage.setTokens(
      response.tokens.accessToken,
      response.tokens.refreshToken
    );

    return response;
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', input, {
      skipAuth: true,
    });

    tokenStorage.setTokens(
      response.tokens.accessToken,
      response.tokens.refreshToken
    );

    return response;
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<AuthTokens>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );

    tokenStorage.setTokens(response.accessToken, response.refreshToken);

    return response;
  },

  async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('/auth/me');
  },

  logout(): void {
    tokenStorage.clearTokens();
  },

  isAuthenticated(): boolean {
    return tokenStorage.hasTokens();
  },
};

httpClient.setRefreshTokenCallback(async () => {
  try {
    const tokens = await authApi.refreshToken();
    return tokens.accessToken;
  } catch {
    authApi.logout();
    return null;
  }
});
