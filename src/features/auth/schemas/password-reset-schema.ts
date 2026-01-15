import { z } from 'zod';

/**
 * Password validation regex
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Password reset form validation schema
 */
export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        PASSWORD_REGEX,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),

    confirmPassword: z.string().min(1, 'Debes confirmar tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Password reset form data type
 */
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
