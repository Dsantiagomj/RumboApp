'use client';

import { PasswordResetRequestForm } from '@/features/auth/components/password-reset-request-form';
import { useRequestPasswordReset } from '@/features/auth/hooks/use-auth';

/**
 * Password Reset Request Page
 *
 * Allows users to request a password reset email.
 * Uses auth layout with hero carousel.
 */
export default function PasswordResetRequestPage() {
  const requestResetMutation = useRequestPasswordReset();

  return (
    <PasswordResetRequestForm
      onSubmit={(data) => requestResetMutation.mutate(data)}
      isLoading={requestResetMutation.isPending}
      isSuccess={requestResetMutation.isSuccess}
    />
  );
}
