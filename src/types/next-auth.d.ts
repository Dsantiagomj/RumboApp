import type { UserRole } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

/**
 * Extend NextAuth types to include custom fields
 *
 * This adds the `role` field to the User and Session types
 * so we can access user role throughout the application
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
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
