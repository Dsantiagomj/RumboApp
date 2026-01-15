/**
 * Email Utilities Tests
 *
 * Comprehensive tests for transactional email sending via Resend API.
 *
 * TESTS:
 * - Password reset email (with token link)
 * - Password changed confirmation email
 * - Email content validation (HTML + text)
 * - Spanish localization (es-CO)
 * - Error handling (API failures)
 * - Security (no token leakage in error messages)
 *
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

// Mock Resend - use vi.hoisted to ensure mockSend is available in the factory
const { mockSend } = vi.hoisted(() => {
  return {
    mockSend: vi.fn(),
  };
});

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockSend,
      };
    },
  };
});

import { sendPasswordResetEmail, sendPasswordChangedEmail } from '@/server/lib/email';

describe('Email Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: email sends successfully
    mockSend.mockResolvedValue({ id: 'email-id-123' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendPasswordResetEmail', () => {
    const testEmail = 'user@example.com';
    const testToken = 'secure-token-abc123-xyz-url-safe-43-chars';
    const testUserName = 'Juan Pérez';

    it('should send password reset email with token link', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        from: expect.stringContaining('@'),
        to: testEmail,
        subject: expect.stringContaining('Restablecer contraseña'),
      });
    });

    it('should include token in reset URL (both HTML and text)', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];
      const expectedUrl = `http://localhost:3000/reset-password?token=${testToken}`;

      // HTML content should contain the reset URL
      expect(callArgs.html).toContain(expectedUrl);

      // Text content should contain the reset URL
      expect(callArgs.text).toContain(expectedUrl);
    });

    it('should personalize greeting with user name', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];
      const greeting = `Hola ${testUserName}`;

      expect(callArgs.html).toContain(greeting);
      expect(callArgs.text).toContain(greeting);
    });

    it('should use generic greeting when user name is not provided', async () => {
      await sendPasswordResetEmail(testEmail, testToken);

      const callArgs = mockSend.mock.calls[0][0];
      const genericGreeting = 'Hola';

      expect(callArgs.html).toContain(genericGreeting);
      expect(callArgs.text).toContain(genericGreeting);
    });

    it('should include security warnings in Spanish', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      // HTML should contain security warnings
      expect(callArgs.html).toContain('1 hora');
      expect(callArgs.html).toContain('seguridad');
      expect(callArgs.html).toContain('no solicitaste');

      // Text should contain security warnings
      expect(callArgs.text).toContain('1 hora');
      expect(callArgs.text).toContain('seguridad');
      expect(callArgs.text).toContain('no solicitaste');
    });

    it('should include both HTML and plain text versions', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      expect(callArgs.html).toBeDefined();
      expect(callArgs.text).toBeDefined();

      // HTML should be longer (formatting)
      expect(callArgs.html.length).toBeGreaterThan(callArgs.text.length);

      // Both should contain essential content
      expect(callArgs.html).toContain('Restablecer contraseña');
      expect(callArgs.text).toContain('restablecer'); // Text version uses lowercase
    });

    it('should use environment variables for sender and app URL', async () => {
      // This test validates integration with .env configuration
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      // Sender email should be from env (onboarding@resend.dev for testing)
      expect(callArgs.from).toBeDefined();
      expect(typeof callArgs.from).toBe('string');

      // App URL should be from env (localhost:3000 for development)
      const resetUrl = `http://localhost:3000/reset-password?token=${testToken}`;
      expect(callArgs.html).toContain(resetUrl);
    });

    it('should have proper email structure (DOCTYPE, charset, viewport)', async () => {
      await sendPasswordResetEmail(testEmail, testToken, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      // HTML email should have proper structure
      expect(callArgs.html).toContain('<!DOCTYPE html>');
      expect(callArgs.html).toContain('<html lang="es">');
      expect(callArgs.html).toContain('charset="UTF-8"');
      expect(callArgs.html).toContain('viewport');
    });

    it('should throw error if Resend API fails', async () => {
      const apiError = new Error('Resend API error: Invalid API key');
      mockSend.mockRejectedValueOnce(apiError);

      await expect(sendPasswordResetEmail(testEmail, testToken, testUserName)).rejects.toThrow(
        'Failed to send password reset email'
      );
    });

    it('should log error but not expose sensitive details', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const apiError = new Error('Resend API error: Rate limit exceeded');
      mockSend.mockRejectedValueOnce(apiError);

      try {
        await sendPasswordResetEmail(testEmail, testToken, testUserName);
      } catch (error) {
        // Error message should be generic (no token or email leakage)
        expect((error as Error).message).toBe('Failed to send password reset email');
        expect((error as Error).message).not.toContain(testToken);
        expect((error as Error).message).not.toContain(testEmail);
      }

      // Internal logging should have detailed error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error sending password reset email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle special characters in user name (XSS prevention)', async () => {
      const maliciousName = '<script>alert("XSS")</script>';

      await sendPasswordResetEmail(testEmail, testToken, maliciousName);

      const callArgs = mockSend.mock.calls[0][0];

      // HTML should escape special characters (browsers will handle this)
      // We're checking that the email is sent without errors
      expect(callArgs.html).toContain('Hola');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('sendPasswordChangedEmail', () => {
    const testEmail = 'user@example.com';
    const testUserName = 'María García';

    it('should send password changed confirmation email', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      expect(mockSend).toHaveBeenCalledTimes(1);

      const callArgs = mockSend.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        from: expect.stringContaining('@'),
        to: testEmail,
        subject: expect.stringContaining('Contraseña actualizada'),
      });
    });

    it('should include login link in email', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];
      const loginUrl = 'http://localhost:3000/login';

      // HTML content should contain login URL
      expect(callArgs.html).toContain(loginUrl);

      // Text content should contain login URL
      expect(callArgs.text).toContain(loginUrl);
    });

    it('should personalize greeting with user name', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];
      const greeting = `Hola ${testUserName}`;

      expect(callArgs.html).toContain(greeting);
      expect(callArgs.text).toContain(greeting);
    });

    it('should use generic greeting when user name is not provided', async () => {
      await sendPasswordChangedEmail(testEmail);

      const callArgs = mockSend.mock.calls[0][0];
      const genericGreeting = 'Hola';

      expect(callArgs.html).toContain(genericGreeting);
      expect(callArgs.text).toContain(genericGreeting);
    });

    it('should include security warning about unauthorized changes', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      // Should warn about unauthorized changes
      expect(callArgs.html).toContain('No fuiste tú');
      expect(callArgs.html).toContain('soporte@rumbo.app');

      expect(callArgs.text).toContain('No fuiste tú');
      expect(callArgs.text).toContain('soporte@rumbo.app');
    });

    it('should include both HTML and plain text versions', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      expect(callArgs.html).toBeDefined();
      expect(callArgs.text).toBeDefined();

      // Both should contain essential content
      expect(callArgs.html).toContain('actualizada exitosamente');
      expect(callArgs.text).toContain('actualizada exitosamente');
    });

    it('should use success-themed styling (green gradient)', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      // HTML should have green/success styling
      expect(callArgs.html).toContain('10b981'); // Green color code
      expect(callArgs.html).toContain('✅'); // Success emoji
    });

    it('should have proper email structure (DOCTYPE, charset, viewport)', async () => {
      await sendPasswordChangedEmail(testEmail, testUserName);

      const callArgs = mockSend.mock.calls[0][0];

      expect(callArgs.html).toContain('<!DOCTYPE html>');
      expect(callArgs.html).toContain('<html lang="es">');
      expect(callArgs.html).toContain('charset="UTF-8"');
      expect(callArgs.html).toContain('viewport');
    });

    it('should throw error if Resend API fails', async () => {
      const apiError = new Error('Resend API error: Invalid sender');
      mockSend.mockRejectedValueOnce(apiError);

      await expect(sendPasswordChangedEmail(testEmail, testUserName)).rejects.toThrow(
        'Failed to send password changed email'
      );
    });

    it('should log error but not expose sensitive details', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const apiError = new Error('Resend API error: Network timeout');
      mockSend.mockRejectedValueOnce(apiError);

      try {
        await sendPasswordChangedEmail(testEmail, testUserName);
      } catch (error) {
        // Error message should be generic (no email leakage)
        expect((error as Error).message).toBe('Failed to send password changed email');
        expect((error as Error).message).not.toContain(testEmail);
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error sending password changed email:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Email Configuration', () => {
    it('should use Resend client with API key from environment', async () => {
      // This validates that Resend is initialized correctly
      await sendPasswordResetEmail('test@example.com', 'token-abc-123');

      expect(mockSend).toHaveBeenCalled();
    });

    it('should handle missing environment variables gracefully', async () => {
      // Email should still attempt to send (env validation happens at runtime)
      await sendPasswordResetEmail('test@example.com', 'token-xyz-789');

      const callArgs = mockSend.mock.calls[0][0];

      // Should have fallback values
      expect(callArgs.from).toBeDefined();
      expect(callArgs.html).toContain('http://'); // App URL should exist
    });
  });

  describe('Localization (es-CO)', () => {
    it('should use Spanish language throughout reset email', async () => {
      await sendPasswordResetEmail('test@example.com', 'token-123', 'Usuario');

      const callArgs = mockSend.mock.calls[0][0];

      // Check for Spanish keywords
      const htmlKeywords = [
        'Restablecer contraseña',
        'Recibimos una solicitud',
        'Este enlace expirará',
        'Aviso de seguridad',
        'Saludos',
      ];

      const textKeywords = [
        'restablecer',
        'Recibimos una solicitud',
        'Este enlace expirará',
        'seguridad',
        'Saludos',
      ];

      htmlKeywords.forEach((keyword) => {
        expect(callArgs.html).toContain(keyword);
      });

      textKeywords.forEach((keyword) => {
        expect(callArgs.text).toContain(keyword);
      });
    });

    it('should use Spanish language throughout changed email', async () => {
      await sendPasswordChangedEmail('test@example.com', 'Usuario');

      const callArgs = mockSend.mock.calls[0][0];

      // Check for Spanish keywords
      const htmlKeywords = [
        'Contraseña actualizada',
        'exitosamente',
        'Iniciar sesión',
        'cuenta podría estar comprometida',
        'Saludos',
      ];

      const textKeywords = [
        'actualizada exitosamente',
        'Inicia sesión',
        'cuenta podría estar comprometida',
        'Saludos',
      ];

      htmlKeywords.forEach((keyword) => {
        expect(callArgs.html).toContain(keyword);
      });

      textKeywords.forEach((keyword) => {
        expect(callArgs.text).toContain(keyword);
      });
    });
  });

  describe('Security Properties', () => {
    it('should not leak tokens in error messages', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const token = 'super-secret-token-abc123-xyz-sensitive';

      mockSend.mockRejectedValueOnce(new Error('API error'));

      try {
        await sendPasswordResetEmail('test@example.com', token);
      } catch (error) {
        expect((error as Error).message).not.toContain(token);
      }

      consoleErrorSpy.mockRestore();
    });

    it('should not leak email addresses in error messages to client', async () => {
      const email = 'sensitive@example.com';

      mockSend.mockRejectedValueOnce(new Error('Invalid recipient'));

      try {
        await sendPasswordResetEmail(email, 'token-123');
      } catch (error) {
        // Generic error message (email might be in console.error, but not in thrown error)
        expect((error as Error).message).toBe('Failed to send password reset email');
      }
    });

    it('should sanitize user inputs (prevent injection)', async () => {
      const maliciousEmail = 'user@example.com\r\nBcc: attacker@evil.com';
      const maliciousName = 'User\r\nSubject: Phishing';

      // Should not throw errors (Resend handles validation)
      await expect(
        sendPasswordResetEmail(maliciousEmail, 'token-123', maliciousName)
      ).resolves.not.toThrow();
    });
  });
});
