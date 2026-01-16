import { LogoutButton } from '@/components/logout-button';
import { auth } from '@/server/auth';

/**
 * App Layout (Protected Routes)
 *
 * Shared layout for authenticated app routes (/onboarding, /dashboard)
 * Includes header with user info and logout button
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Rumbo</h1>
            {session?.user?.email && (
              <span className="text-muted-foreground hidden text-sm sm:inline">
                • {session.user.email}
              </span>
            )}
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
