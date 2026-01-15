'use client';

import { RegisterForm } from '@/features/auth/components/register-form';
import { useRegister } from '@/features/auth/hooks/use-auth';

/**
 * Register Page
 *
 * Displays the registration form with social auth options.
 * Uses auth layout with hero carousel.
 */
export default function RegisterPage() {
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
