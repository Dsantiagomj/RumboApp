'use client';

import { use, useState } from 'react';

import { PasswordResetForm } from '@/features/auth/components/password-reset-form';
import type { PasswordResetFormData } from '@/features/auth/schemas/password-reset-schema';

/**
 * Password Reset Page
 *
 * Allows users to set a new password using a reset token.
 * Uses auth layout with hero carousel.
 */
export default function PasswordResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: PasswordResetFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement tRPC resetPassword mutation
      console.log('Password reset data:', { token, ...data });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return <PasswordResetForm onSubmit={handleSubmit} isLoading={isLoading} isSuccess={isSuccess} />;
}
