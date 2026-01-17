import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { ImportWizard } from '@/features/import/components/import-wizard';

/**
 * Import Page
 *
 * Multi-step wizard for importing bank statements
 * Authenticated users only
 */
export default async function ImportPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container py-8">
      <ImportWizard />
    </div>
  );
}
