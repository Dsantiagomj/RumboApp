'use client';

import { useState } from 'react';

import { PasswordResetRequestForm } from '@/features/auth/components/password-reset-request-form';
import type { PasswordResetRequestFormData } from '@/features/auth/schemas/password-reset-request-schema';

/**
 * Password Reset Request Page
 *
 * Allows users to request a password reset email.
 * Uses auth layout with hero carousel.
 */
export default function PasswordResetRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: PasswordResetRequestFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement tRPC requestPasswordReset mutation
      console.log('Password reset request data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PasswordResetRequestForm onSubmit={handleSubmit} isLoading={isLoading} isSuccess={isSuccess} />
  );
}
