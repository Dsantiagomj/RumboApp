import type { UserRole } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

/**
 * Extend NextAuth types to include custom fields
 *
 * This adds the `role` and `onboardingCompletedAt` fields to the User and Session types
 * so we can access user role and onboarding status throughout the application
 */

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
      onboardingCompletedAt?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    onboardingCompletedAt?: string | null;
  }
}
