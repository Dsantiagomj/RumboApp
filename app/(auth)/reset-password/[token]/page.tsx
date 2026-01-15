'use client';

import { use } from 'react';

import { PasswordResetForm } from '@/features/auth/components/password-reset-form';
import { useResetPassword } from '@/features/auth/hooks/use-auth';

/**
 * Password Reset Page
 *
 * Allows users to set a new password using a reset token.
 * Uses auth layout with hero carousel.
 */
export default function PasswordResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
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
