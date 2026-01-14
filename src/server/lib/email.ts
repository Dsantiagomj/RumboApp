/**
 * Email sending utilities using Resend API
 *
 * This module provides email sending functionality for authentication flows.
 * All emails are sent via Resend API with proper error handling and logging.
 *
 * Environment variables required:
 * - RESEND_API_KEY: Resend API key
 * - RESEND_FROM_EMAIL: Sender email address (e.g., noreply@rumbo.app)
 * - NEXTAUTH_URL: Application URL for generating links
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email configuration
 */
const EMAIL_CONFIG = {
  from: process.env.RESEND_FROM_EMAIL ?? 'noreply@rumbo.app',
  appName: 'Rumbo',
  appUrl: process.env.NEXTAUTH_URL ?? 'http://localhost:3000',
} as const;

/**
 * Send a password reset email with a secure reset link
 *
 * @param email - Recipient email address
 * @param token - Password reset token
 * @param userName - User's name (optional, for personalization)
 * @returns Resend API response
 *
 * @throws {Error} If email sending fails
 *
 * @example
 * ```ts
 * await sendPasswordResetEmail('user@example.com', 'abc123...', 'John Doe');
 * ```
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName?: string
): Promise<void> {
  const resetUrl = `${EMAIL_CONFIG.appUrl}/reset-password?token=${token}`;
  const greeting = userName ? `Hola ${userName}` : 'Hola';

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer contraseña - ${EMAIL_CONFIG.appName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔐 ${EMAIL_CONFIG.appName}</h1>
  </div>

  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Solicitud de restablecimiento de contraseña</h2>

    <p style="font-size: 16px; color: #4b5563;">${greeting},</p>

    <p style="font-size: 16px; color: #4b5563;">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${EMAIL_CONFIG.appName}.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}"
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
        Restablecer contraseña
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      <strong>O copia y pega este enlace en tu navegador:</strong><br>
      <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
    </p>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>⏱️ Este enlace expirará en 1 hora</strong> por motivos de seguridad.
      </p>
    </div>

    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        <strong>🔒 Aviso de seguridad:</strong><br>
        Si no solicitaste este restablecimiento, puedes ignorar este correo de forma segura. Tu contraseña no cambiará a menos que hagas clic en el enlace anterior y establezcas una nueva.
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
      Saludos,<br>
      <strong>El equipo de ${EMAIL_CONFIG.appName}</strong>
    </p>

    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Este es un correo automático, por favor no respondas a este mensaje.<br>
      Si tienes problemas, contáctanos en soporte@rumbo.app
    </p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
${greeting},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en ${EMAIL_CONFIG.appName}.

Para restablecer tu contraseña, haz clic en el siguiente enlace:
${resetUrl}

IMPORTANTE:
- Este enlace expirará en 1 hora por motivos de seguridad.
- Si no solicitaste este restablecimiento, puedes ignorar este correo.
- Tu contraseña no cambiará a menos que hagas clic en el enlace y establezcas una nueva.

Saludos,
El equipo de ${EMAIL_CONFIG.appName}

---
Este es un correo automático, por favor no respondas a este mensaje.
Si tienes problemas, contáctanos en soporte@rumbo.app
  `.trim();

  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `Restablecer contraseña - ${EMAIL_CONFIG.appName}`,
      html: htmlContent,
      text: textContent,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Send a password change confirmation email
 *
 * This email is sent after a successful password reset to notify the user.
 *
 * @param email - Recipient email address
 * @param userName - User's name (optional, for personalization)
 * @returns Resend API response
 *
 * @throws {Error} If email sending fails
 *
 * @example
 * ```ts
 * await sendPasswordChangedEmail('user@example.com', 'John Doe');
 * ```
 */
export async function sendPasswordChangedEmail(email: string, userName?: string): Promise<void> {
  const greeting = userName ? `Hola ${userName}` : 'Hola';
  const loginUrl = `${EMAIL_CONFIG.appUrl}/login`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contraseña actualizada - ${EMAIL_CONFIG.appName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ ${EMAIL_CONFIG.appName}</h1>
  </div>

  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Contraseña actualizada exitosamente</h2>

    <p style="font-size: 16px; color: #4b5563;">${greeting},</p>

    <p style="font-size: 16px; color: #4b5563;">
      Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}"
         style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(16, 185, 129, 0.25);">
        Iniciar sesión
      </a>
    </div>

    <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991b1b;">
        <strong>⚠️ ¿No fuiste tú?</strong><br>
        Si no realizaste este cambio, tu cuenta podría estar comprometida. Por favor, contacta inmediatamente a soporte@rumbo.app
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

    <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">
      Saludos,<br>
      <strong>El equipo de ${EMAIL_CONFIG.appName}</strong>
    </p>

    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      Este es un correo automático, por favor no respondas a este mensaje.<br>
      Si tienes problemas, contáctanos en soporte@rumbo.app
    </p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
${greeting},

Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.

Inicia sesión aquí: ${loginUrl}

¿No fuiste tú?
Si no realizaste este cambio, tu cuenta podría estar comprometida. Por favor, contacta inmediatamente a soporte@rumbo.app

Saludos,
El equipo de ${EMAIL_CONFIG.appName}

---
Este es un correo automático, por favor no respondas a este mensaje.
Si tienes problemas, contáctanos en soporte@rumbo.app
  `.trim();

  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `Contraseña actualizada - ${EMAIL_CONFIG.appName}`,
      html: htmlContent,
      text: textContent,
    });
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw new Error('Failed to send password changed email');
  }
}
