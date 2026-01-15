import type { NextAuthConfig } from 'next-auth';

/**
 * NextAuth Middleware Config (Edge Runtime Compatible)
 *
 * This config is used ONLY in middleware.ts for Edge Runtime.
 * It doesn't include providers (which require Node.js APIs like argon2).
 *
 * For full config with providers, see config.ts
 */
export const authMiddlewareConfig = {
  // Session configuration (must match main config)
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Refresh every 1 hour
  },

  // No providers needed in middleware (Edge Runtime can't run them anyway)
  providers: [],

  // Callbacks (must match main config for JWT structure)
  callbacks: {
    // JWT callback - Must match main config
    async jwt({ token }) {
      // Token already contains all data from main config
      // Just pass it through
      return token;
    },

    // Session callback - Must match main config
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.onboardingCompletedAt = token.onboardingCompletedAt as string | null;
      }
      return session;
    },
  },

  // Pages must match main config
  pages: {
    signIn: '/login',
  },

  // Disable debug in middleware
  debug: false,
} satisfies NextAuthConfig;
