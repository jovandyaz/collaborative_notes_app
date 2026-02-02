import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tokenStorage } from '@knowtis/api-client';
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  UserProfile,
} from '@knowtis/shared-types';

import { authApi } from '../api';
import { useAuthStore } from './auth.store';

export const authQueryKeys = {
  all: ['auth'] as const,
  profile: () => [...authQueryKeys.all, 'profile'] as const,
} as const;

export function useAuthInitialization() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const initializeAuth = async () => {
      const { hasRefreshToken } = tokenStorage.initialize();

      if (!hasRefreshToken) {
        setLoading(false);
        return;
      }

      try {
        await authApi.refreshToken();

        const user = await authApi.getProfile();

        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        });
      } catch {
        logout();
      }
    };

    initializeAuth();
  }, [setUser, setLoading, logout]);
}

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: authQueryKeys.profile(),
    queryFn: async (): Promise<UserProfile> => {
      const profile = await authApi.getProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      });
      return profile;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const handleAuthSuccess = useAuthStore((state) => state.handleAuthSuccess);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (response: AuthResponse) => {
      handleAuthSuccess(response);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  });
}

export function useRegister() {
  const handleAuthSuccess = useAuthStore((state) => state.handleAuthSuccess);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (response: AuthResponse) => {
      handleAuthSuccess(response);
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authApi.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}
