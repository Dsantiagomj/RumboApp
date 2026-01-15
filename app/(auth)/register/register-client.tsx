'use client';

import { signIn } from 'next-auth/react';

import { RegisterForm } from '@/features/auth/components/register-form';
import { useRegister } from '@/features/auth/hooks/use-auth';

/**
 * Register Client Component
 */
export function RegisterClient() {
  const registerMutation = useRegister();

  const handleGoogleClick = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleAppleClick = async () => {
    // Apple OAuth not configured yet
    console.log('Apple OAuth not configured');
  };

  return (
    <RegisterForm
      onSubmit={(data) => registerMutation.mutate(data)}
      onGoogleClick={handleGoogleClick}
      onAppleClick={handleAppleClick}
      isLoading={registerMutation.isPending}
      error={registerMutation.isError ? registerMutation.error.message : null}
    />
  );
}
