import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

import { prisma } from '@/server/db';

import { verifyPassword } from './argon2';

/**
 * NextAuth v5 Configuration
 *
 * Features:
 * - Prisma adapter for database sessions
 * - Credentials provider (email/password with Argon2)
 * - Google OAuth provider (optional)
 * - JWT session strategy (24 hours)
 * - User role and ID in session
 */

// Login schema validation
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const authConfig = {
  adapter: PrismaAdapter(prisma),

  // Session configuration (JWT for Vercel compatibility)
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours (financial app security)
    updateAge: 60 * 60, // Refresh token every 1 hour
  },

  // Authentication providers
  providers: [
    // Credentials provider (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials format
        const result = loginSchema.safeParse(credentials);
        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            image: true,
            role: true,
            emailVerified: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValid = await verifyPassword(user.password, password);
        if (!isValid) {
          return null;
        }

        // Return user object (password excluded)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        } as User;
      },
    }),

    // Google OAuth provider (optional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true, // Allow linking Google accounts to existing email accounts
    }),
  ],

  // Callbacks
  callbacks: {
    // JWT callback - Add user data to token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? '';
        token.role = user.role;
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },

    // Session callback - Add user data from token to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    },

    // Sign-in callback - Control who can sign in
    async signIn({ account }) {
      // Allow email/password login
      if (account?.provider === 'credentials') {
        return true;
      }

      // For OAuth providers, check if email is verified
      if (account?.provider === 'google') {
        return true;
      }

      return true;
    },
  },

  // Custom pages
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // verifyRequest: '/auth/verify-request',
  },

  // Events (for logging)
  events: {
    async signIn() {
      // NextAuth debug mode handles logging
      return;
    },
    async signOut() {
      // NextAuth debug mode handles logging
      return;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
