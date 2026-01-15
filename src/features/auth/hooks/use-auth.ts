'use client';

/**
 * Auth hooks
 *
 * Custom hooks that wrap tRPC auth procedures with:
 * - Better error handling
 * - Success/error toasts (TODO: add toast system)
 * - Automatic redirects
 * - TypeScript inference
 */

import { useRouter } from 'next/navigation';

import { trpc } from '@/lib/trpc/react';

import type { LoginFormData } from '../schemas/login-schema';
import type { PasswordResetRequestFormData } from '../schemas/password-reset-request-schema';
import type { PasswordResetFormData } from '../schemas/password-reset-schema';
import type { RegisterFormData } from '../schemas/register-schema';

/**
 * Register hook
 *
 * Handles user registration with automatic redirect to login
 *
 * @example
 * ```tsx
 * const register = useRegister();
 *
 * const handleSubmit = (data: RegisterFormData) => {
 *   register.mutate(data);
 * };
 * ```
 */
export function useRegister() {
  const router = useRouter();

  return trpc.auth.register.useMutation({
    onSuccess: () => {
      // TODO: Show success toast
      // Redirect to login page
      router.push('/login');
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error('Registration failed:', error.message);
    },
  });
}

/**
 * Login hook
 *
 * Handles user login with automatic redirect to dashboard
 *
 * @example
 * ```tsx
 * const login = useLogin();
 *
 * const handleSubmit = (data: LoginFormData) => {
 *   login.mutate(data);
 * };
 * ```
 */
export function useLogin() {
  const router = useRouter();

  return trpc.auth.login.useMutation({
    onSuccess: () => {
      // TODO: Show success toast
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error('Login failed:', error.message);
    },
  });
}

/**
 * Logout hook
 *
 * Handles user logout with automatic redirect to login
 *
 * @example
 * ```tsx
 * const logout = useLogout();
 *
 * <button onClick={() => logout.mutate()}>
 *   Logout
 * </button>
 * ```
 */
export function useLogout() {
  const router = useRouter();

  return trpc.auth.logout.useMutation({
    onSuccess: () => {
      // TODO: Show success toast
      // Redirect to login page
      router.push('/login');
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error('Logout failed:', error.message);
    },
  });
}

/**
 * Password reset request hook
 *
 * Sends password reset email
 *
 * @example
 * ```tsx
 * const requestReset = useRequestPasswordReset();
 *
 * const handleSubmit = (data: PasswordResetRequestFormData) => {
 *   requestReset.mutate(data);
 * };
 * ```
 */
export function useRequestPasswordReset() {
  return trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      // TODO: Show success toast
      console.log('Password reset email sent (if account exists)');
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error('Password reset request failed:', error.message);
    },
  });
}

/**
 * Password reset hook
 *
 * Resets password with token
 *
 * @example
 * ```tsx
 * const resetPassword = useResetPassword();
 *
 * const handleSubmit = (data: PasswordResetFormData) => {
 *   resetPassword.mutate({ token, ...data });
 * };
 * ```
 */
export function useResetPassword() {
  const router = useRouter();

  return trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      // TODO: Show success toast
      // Redirect to login page after short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error('Password reset failed:', error.message);
    },
  });
}

/**
 * Type exports for convenience
 */
export type {
  LoginFormData,
  PasswordResetFormData,
  PasswordResetRequestFormData,
  RegisterFormData,
};
