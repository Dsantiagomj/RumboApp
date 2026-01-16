import type { ColombianIdType } from '@prisma/client';
import { prisma } from '@/server/db';

/**
 * Complete Identity Verification (Step 2 of Onboarding)
 *
 * Saves user's Colombian ID info and marks onboarding as complete
 */
export async function completeIdentityVerification(
  userId: string,
  data: {
    documentType: ColombianIdType;
    documentNumber: string;
  }
): Promise<{ success: boolean; onboardingCompletedAt: Date }> {
  const now = new Date();

  // Update user with identity info and mark onboarding as complete
  await prisma.user.update({
    where: { id: userId },
    data: {
      colombianIdType: data.documentType,
      colombianId: data.documentNumber,
      onboardingCompletedAt: now,
    },
  });

  return {
    success: true,
    onboardingCompletedAt: now,
  };
}
