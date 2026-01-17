import { auth } from '@/server/auth';
import { prisma } from '@/server/db';
import { DashboardEmptyState, FloatingActionButton } from '@/features/dashboard/components';

/**
 * Dashboard Page
 *
 * Main dashboard for authenticated users who have completed onboarding
 *
 * Conditional rendering:
 * - No accounts: Show empty state with account creation CTAs
 * - Has accounts: Show dashboard content with FAB for adding more accounts
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  // Check if user has financial accounts
  const accountCount = await prisma.financialAccount.count({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
  });

  const hasAccounts = accountCount > 0;

  // Empty state: No accounts yet
  if (!hasAccounts) {
    return (
      <div className="container py-8">
        <DashboardEmptyState />
      </div>
    );
  }

  // Populated state: User has accounts
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido de vuelta, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Placeholder cards - will be replaced with actual account data */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold">Resumen Financiero</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Próximamente: Vista general de tus finanzas
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold">Transacciones</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Próximamente: Últimas transacciones
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold">Presupuestos</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Próximamente: Estado de tus presupuestos
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for adding more accounts */}
      <FloatingActionButton />
    </div>
  );
}
