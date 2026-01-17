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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir menú para agregar nueva cuenta financiera"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        className="from-primary fixed right-6 bottom-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r to-purple-600 shadow-lg transition-shadow hover:shadow-xl sm:right-8 sm:bottom-8"
      >
        <Plus className="h-6 w-6 text-white" />
        <span className="sr-only">Agregar Cuenta</span>
      </motion.button>

      <AccountCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
