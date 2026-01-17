'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AccountCreationModal } from '../account-creation-modal';

/**
 * Floating Action Button (FAB)
 *
 * Persistent button shown when user has accounts
 * Opens modal for account creation method selection
 *
 * Position: Bottom-right for right-handed thumb accessibility
 */
export function FloatingActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsModalOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir menú para agregar nueva cuenta financiera"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        className="group from-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r to-purple-600 shadow-lg transition-all hover:shadow-xl sm:right-8 sm:bottom-8"
      >
        <div className="absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <Plus className="relative h-6 w-6 text-white" />
        <span className="sr-only">Agregar Cuenta</span>
      </motion.button>

      <AccountCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
