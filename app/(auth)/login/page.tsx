import { Suspense } from 'react';

import { LoginClient } from './login-client';

/**
 * Login Page (Server Component)
 *
 * Displays the login form with social auth options.
 * Uses auth layout with hero carousel.
 *
 * Wrapped in Suspense to prevent Math.random() prerender errors
 * from framer-motion animations in client components.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Cargando...</div>}>
      <LoginClient />
    </Suspense>
  );
}
