import { auth } from '@/server/auth';

/**
 * Dashboard Page
 *
 * Main dashboard for authenticated users who have completed onboarding
 */
export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenido de vuelta, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Placeholder cards */}
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
    </div>
  );
}
