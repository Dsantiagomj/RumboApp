import { Suspense } from 'react';

import { PasswordResetRequestClient } from './reset-password-request-client';

/**
 * Password Reset Request Page (Server Component)
 *
 * Allows users to request a password reset email.
 * Uses auth layout with hero carousel.
 *
 * Wrapped in Suspense to prevent Math.random() prerender errors
 * from framer-motion animations in client components.
 */
export default function PasswordResetRequestPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Cargando...</div>}>
      <PasswordResetRequestClient />
    </Suspense>
  );
}
