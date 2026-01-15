import { Suspense } from 'react';

import { RegisterClient } from './register-client';

/**
 * Register Page (Server Component)
 *
 * Displays the registration form with social auth options.
 * Uses auth layout with hero carousel.
 *
 * Wrapped in Suspense to prevent Math.random() prerender errors
 * from framer-motion animations in client components.
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Cargando...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
