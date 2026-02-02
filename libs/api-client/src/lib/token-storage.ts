import { STORAGE_KEYS } from './config';

type TokenChangeCallback = (hasToken: boolean) => void;

class TokenStorage {
  private accessToken: string | null = null;
  private listeners: Set<TokenChangeCallback> = new Set();

  setAccessToken(token: string | null): void {
    this.accessToken = token;
    this.notifyListeners();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setRefreshToken(token: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearTokens(): void {
    this.setAccessToken(null);
    this.setRefreshToken(null);
  }

  hasTokens(): boolean {
    return this.accessToken !== null;
  }

  subscribe(callback: TokenChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    const hasToken = this.hasTokens();
    this.listeners.forEach((cb) => cb(hasToken));
  }

  initialize(): { hasRefreshToken: boolean } {
    return {
      hasRefreshToken: this.getRefreshToken() !== null,
    };
  }
}

export const tokenStorage = new TokenStorage();
