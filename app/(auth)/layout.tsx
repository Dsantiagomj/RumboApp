import type { Metadata } from 'next';

import { AuthHero } from '@/features/auth/components/auth-hero';

export const metadata: Metadata = {
  title: 'Rumbo - Autenticación',
  description: 'Inicia sesión o crea una cuenta en Rumbo',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      {/* Desktop: Split-screen (hero left, form right) */}
      {/* Mobile: Simple background (respects light/dark mode) */}
      <div className="flex min-h-screen flex-row">
        {/* Hero Background - Only visible on desktop */}
        <div className="hidden lg:block lg:w-1/2">
          <AuthHero />
        </div>

        {/* Form Section - Full width on mobile, Right half on desktop */}
        <div className="flex min-h-screen w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
