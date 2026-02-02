// @vitest-environment jsdom
import { act } from 'react';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { tokenStorage } from '@knowtis/api-client';

import { useAuthStore } from './auth.store';

// Mock tokenStorage
vi.mock('@knowtis/api-client', () => ({
  tokenStorage: {
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    initialize: vi.fn(() => ({ hasRefreshToken: false })),
    getAccessToken: vi.fn(),
  },
}));

// Mock zustand persist middleware to behave like a simple pass-through
// This avoids issues with localStorage during testing and isolates store logic
vi.mock('zustand/middleware', async () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    persist: (config: any) => (set: any, get: any, api: any) =>
      config(set, get, api),
  };
});

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it('should set user and update state', () => {
    const user = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      avatarUrl: null,
    };

    act(() => {
      useAuthStore.getState().setUser(user);
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('should handle auth success', () => {
    const response = {
      user: {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        avatarUrl: null,
      },
      tokens: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      },
    };

    act(() => {
      useAuthStore.getState().handleAuthSuccess(response);
    });

    const state = useAuthStore.getState();
    expect(state.user).toEqual(response.user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);

    expect(tokenStorage.setTokens).toHaveBeenCalledWith(
      'access-token',
      'refresh-token'
    );
  });

  it('should logout and clear state and tokens', () => {
    // Set initial logged in state
    act(() => {
      useAuthStore.setState({
        user: { id: '1', email: 'test', name: 'test', avatarUrl: null },
        isAuthenticated: true,
        isLoading: false,
      });
    });

    act(() => {
      useAuthStore.getState().logout();
    });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);

    expect(tokenStorage.clearTokens).toHaveBeenCalled();
  });

  it('should set loading state', () => {
    act(() => {
      useAuthStore.getState().setLoading(false);
    });
    expect(useAuthStore.getState().isLoading).toBe(false);

    act(() => {
      useAuthStore.getState().setLoading(true);
    });
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});
