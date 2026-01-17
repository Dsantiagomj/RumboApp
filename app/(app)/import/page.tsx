import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

/**
 * Import Page
 *
 * Photo upload interface for bank statement scanning
 * Uses Vision API to extract transactions
 *
 * Flow:
 * 1. User uploads photo of bank statement
 * 2. File uploaded to R2 storage
 * 3. ImportJob created and queued for processing
 * 4. Worker downloads, processes with Vision API
 * 5. User reviews extracted accounts/transactions
 * 6. User confirms import → Creates FinancialAccounts
 */
export default async function ImportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Importar Extracto Bancario</h1>
          <p className="text-muted-foreground mt-2">
            Sube una foto de tu extracto y nuestra IA extraerá las transacciones automáticamente
          </p>
        </div>

        {/* Placeholder - Will be replaced with actual upload component in next phase */}
        <div className="bg-card flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed p-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-4 text-lg font-medium">
              🚧 Interfaz de carga en construcción
            </div>
            <p className="text-muted-foreground text-sm">
              Próximamente: Arrastra tu extracto o toma una foto
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              La API de Vision ya está implementada (Fase 2 completada)
            </p>
          </div>
        </div>

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
