'use client';

import { LoginForm } from '@/features/auth/components/login-form';
import { useLogin } from '@/features/auth/hooks/use-auth';

/**
 * Login Client Component
 */
export function LoginClient() {
  const loginMutation = useLogin();

  const handleGoogleClick = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth clicked');
  };

  const handleAppleClick = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple OAuth clicked');
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
