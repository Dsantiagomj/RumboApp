'use client';

import { PasswordResetForm } from '@/features/auth/components/password-reset-form';
import { useResetPassword } from '@/features/auth/hooks/use-auth';

/**
 * Client component for password reset
 */
export function PasswordResetClient({ token }: { token: string }) {
  const resetPasswordMutation = useResetPassword();

  return (
    <PasswordResetForm
      onSubmit={(data) =>
        resetPasswordMutation.mutate({
          token,
          newPassword: data.password,
        })
      }
      isLoading={resetPasswordMutation.isPending}
      isSuccess={resetPasswordMutation.isSuccess}
    />
  );
}
