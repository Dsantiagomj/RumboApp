'use client';

import { signIn } from 'next-auth/react';

import { LoginForm } from '@/features/auth/components/login-form';
import { useLogin } from '@/features/auth/hooks/use-auth';

/**
 * Login Client Component
 */
export function LoginClient() {
  const loginMutation = useLogin();

  const handleGoogleClick = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleAppleClick = async () => {
    // Apple OAuth not configured yet
    console.log('Apple OAuth not configured');
  };

  return (
    <LoginForm
      onSubmit={(data) => loginMutation.mutate(data)}
      onGoogleClick={handleGoogleClick}
      onAppleClick={handleAppleClick}
      isLoading={loginMutation.isPending}
    />
  );
}
