'use client';

import { PasswordResetRequestForm } from '@/features/auth/components/password-reset-request-form';
import { useRequestPasswordReset } from '@/features/auth/hooks/use-auth';

/**
 * Password Reset Request Client Component
 */
export function PasswordResetRequestClient() {
  const requestResetMutation = useRequestPasswordReset();

  return (
    <PasswordResetRequestForm
      onSubmit={(data) => requestResetMutation.mutate(data)}
      isLoading={requestResetMutation.isPending}
      isSuccess={requestResetMutation.isSuccess}
      error={requestResetMutation.isError ? requestResetMutation.error.message : null}
    />
  );
}
