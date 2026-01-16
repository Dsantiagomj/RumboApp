import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { completeIdentityVerification } from './procedures/complete-identity-verification';
import { savePersonalInfo } from './procedures/save-personal-info';

/**
 * Onboarding Router
 *
 * Handles the multi-step onboarding flow:
 * - Step 1: Save personal info (DOB, phone)
 * - Step 2: Complete identity verification (document type + number)
 */

export const onboardingRouter = createTRPCRouter({
  /**
   * Save Personal Info (Step 1)
   */
  savePersonalInfo: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.string(), // ISO date string (YYYY-MM-DD)
        phoneNumber: z.string().min(1, 'Phone number is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return savePersonalInfo(ctx.session.user.id, input);
    }),

  /**
   * Complete Identity Verification (Step 2)
   */
  completeIdentityVerification: protectedProcedure
    .input(
      z.object({
        documentType: z.enum(['CC', 'CE', 'PASAPORTE']),
        documentNumber: z.string().min(1, 'Document number is required'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return completeIdentityVerification(ctx.session.user.id, input);
    }),
});
