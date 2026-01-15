'use client';

import { useState } from 'react';

import { RegisterForm } from '@/features/auth/components/register-form';
import type { RegisterFormData } from '@/features/auth/schemas/register-schema';

/**
 * Register Page
 *
 * Displays the registration form with social auth options.
 * Uses auth layout with hero carousel.
 */
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement tRPC register mutation
      console.log('Register data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      onSubmit={handleSubmit}
      onGoogleClick={handleGoogleClick}
      onAppleClick={handleAppleClick}
      isLoading={isLoading}
    />
  );
}
