'use client';

import { useState } from 'react';

import { LoginForm } from '@/features/auth/components/login-form';
import type { LoginFormData } from '@/features/auth/schemas/login-schema';

/**
 * Login Page
 *
 * Displays the login form with social auth options.
 * Uses auth layout with hero carousel.
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement tRPC login mutation
      console.log('Login data:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Login error:', error);
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
    <LoginForm
      onSubmit={handleSubmit}
      onGoogleClick={handleGoogleClick}
      onAppleClick={handleAppleClick}
      isLoading={isLoading}
    />
  );
}
