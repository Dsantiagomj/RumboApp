import { prisma } from '@/server/db';

/**
 * Save Personal Info (Step 1 of Onboarding)
 *
 * Saves user's date of birth and phone number
 */
export async function savePersonalInfo(
  userId: string,
  data: {
    dateOfBirth: string; // ISO date string
    phoneNumber: string;
  }
): Promise<{ success: boolean }> {
  // Parse date string to Date object
  const dateOfBirth = new Date(data.dateOfBirth);

  // Update user with personal info
  await prisma.user.update({
    where: { id: userId },
    data: {
      dateOfBirth,
      phoneNumber: data.phoneNumber,
    },
  });

  return { success: true };
}
