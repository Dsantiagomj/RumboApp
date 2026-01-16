import { Suspense } from 'react';

import { PasswordResetClient } from './reset-password-client';

/**
 * Password Reset Page (Server Component)
 *
 * Allows users to set a new password using a reset token.
 * Uses auth layout with hero carousel.
 *
 * Wrapped in Suspense to prevent Math.random() prerender errors
 * from framer-motion animations in client components.
 */
export default async function PasswordResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Cargando...</div>}>
      <PasswordResetClient token={token} />
    </Suspense>
  );
}
