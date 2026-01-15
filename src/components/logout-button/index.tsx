'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

/**
 * Logout Button Component
 *
 * Handles user sign-out with loading state
 */
export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-destructive/10 text-destructive hover:bg-destructive/20 focus:ring-destructive/50 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Cerrar sesión"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}
