import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { tokenStorage } from '@knowtis/api-client';
import type { AuthResponse } from '@knowtis/shared-types';

import type { AuthStore, AuthUser } from './auth.store.types';

const AUTH_STORAGE_KEY = 'knowtis-auth';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user: AuthUser | null) =>
        set({
          user,
          isAuthenticated: user !== null,
          isLoading: false,
        }),

      handleAuthSuccess: (response: AuthResponse) => {
        tokenStorage.setTokens(
          response.tokens.accessToken,
          response.tokens.refreshToken
        );

        set({
          user: {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            avatarUrl: response.user.avatarUrl,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenStorage.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.isAuthenticated) {
          const { hasRefreshToken } = tokenStorage.initialize();

          if (!hasRefreshToken) {
            state.logout();
            return;
          }
        }
        state?.setLoading(false);
      },
    }
  )
);

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
