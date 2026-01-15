'use client';

import { RegisterForm } from '@/features/auth/components/register-form';
import { useRegister } from '@/features/auth/hooks/use-auth';

/**
 * Register Client Component
 */
export function RegisterClient() {
  const registerMutation = useRegister();

  const handleGoogleClick = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth clicked');
  };

  const handleAppleClick = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple OAuth clicked');
  };

  return (
    <RegisterForm
      onSubmit={(data) => registerMutation.mutate(data)}
      onGoogleClick={handleGoogleClick}
      onAppleClick={handleAppleClick}
      isLoading={registerMutation.isPending}
    />
  );
}
