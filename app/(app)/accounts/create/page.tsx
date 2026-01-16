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
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Agrega una cuenta bancaria, tarjeta de crédito o préstamo para empezar a trackear tus
            finanzas
          </p>
        </div>

        {/* Account Creation Form */}
        <CreateAccountForm />
      </div>
    </div>
  );
}
