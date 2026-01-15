/**
 * Identity Verification schema
 *
 * Validation for step 2 of onboarding: KYC document verification
 */

import { z } from 'zod';

/**
 * Colombian ID types
 */
export const documentTypes = ['CC', 'CE', 'Passport'] as const;

/**
 * Identity verification validation schema
 */
export const identityVerificationSchema = z.object({
  documentType: z.enum(documentTypes, {
    errorMap: () => ({ message: 'Selecciona un tipo de documento' }),
  }),

  documentNumber: z
    .string()
    .min(1, 'El número de documento es requerido')
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9]+$/i, 'El número de documento solo puede contener letras y números'),
});

/**
 * Identity verification form data type
 */
export type IdentityVerificationFormData = z.infer<typeof identityVerificationSchema>;

/**
 * Document type labels
 */
export const documentTypeLabels: Record<(typeof documentTypes)[number], string> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  Passport: 'Pasaporte',
};
