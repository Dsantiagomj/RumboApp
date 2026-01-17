import { redirect } from 'next/navigation';

import { CreateAccountForm } from '@/features/account/components/create-account-form';
import { auth } from '@/server/auth';

/**
 * Account Creation Page (Server Component)
 *
 * Allows authenticated users to add a new account to track their finances.
 * Supports creating bank accounts, credit cards, and loans.
 */
export default async function CreateAccountPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="space-y-8">
        {/* Account Creation Form (has its own header with icon) */}
        <CreateAccountForm />

        {/* Back button */}
        <div className="flex justify-center">
          <a
            href="/dashboard"
            className="hover:bg-accent text-muted-foreground rounded-lg px-4 py-2 text-sm transition-colors"
          >
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
