import { Suspense } from 'react';

import { OnboardingClient } from './onboarding-client';

/**
 * Onboarding Page (Server Component)
 *
 * Multi-step onboarding flow for new users:
 * - Step 1: Personal Information (DOB, phone)
 * - Step 2: Identity Verification (document type + number)
 *
 * Wrapped in Suspense to prevent Math.random() prerender errors
 * from framer-motion animations in client components.
 */
export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-8">Cargando...</div>
      }
    >
      <OnboardingClient />
    </Suspense>
  );
}
