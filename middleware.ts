import NextAuth from 'next-auth';
import { authMiddlewareConfig } from '@/server/auth/middleware-config';

/**
 * Next.js Middleware for Route Protection
 *
 * Flow:
 * 1. Unauthenticated users accessing protected routes → /login
 * 2. Authenticated users without onboarding accessing /dashboard → /onboarding
 * 3. Authenticated users with onboarding accessing /onboarding → /dashboard
 *
 * Protected routes:
 * - /dashboard/* - Requires auth + completed onboarding
 * - /onboarding - Requires auth
 */

// Create NextAuth middleware using Edge-safe config (no Node.js dependencies)
const { auth } = NextAuth(authMiddlewareConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const hasCompletedOnboarding = !!req.auth?.user?.onboardingCompletedAt;

  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].some((path) =>
    nextUrl.pathname.startsWith(path)
  );
  const isOnboardingRoute = nextUrl.pathname.startsWith('/onboarding');
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');
  const isApiRoute = nextUrl.pathname.startsWith('/api');

  // Don't protect API routes
  if (isApiRoute) {
    return;
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute && isLoggedIn) {
    const redirectUrl = hasCompletedOnboarding ? '/dashboard' : '/onboarding';
    return Response.redirect(new URL(redirectUrl, nextUrl));
  }

  // Protect onboarding route - requires authentication
  if (isOnboardingRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    // If user already completed onboarding, redirect to dashboard
    if (hasCompletedOnboarding) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
    return;
  }

  // Protect dashboard routes - requires authentication + onboarding
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    // If user hasn't completed onboarding, redirect to onboarding
    if (!hasCompletedOnboarding) {
      return Response.redirect(new URL('/onboarding', nextUrl));
    }
    return;
  }

  return;
});

// Matcher configuration - run middleware on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
