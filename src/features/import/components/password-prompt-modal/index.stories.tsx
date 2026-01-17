import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { PasswordPromptModal } from './index';

const meta = {
  title: 'Features/Import/PasswordPromptModal',
  component: PasswordPromptModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordPromptModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive wrapper to control modal state
 */
function InteractiveWrapper({
  userHasColombianId,
  fileName,
  shouldFail,
}: {
  userHasColombianId: boolean;
  fileName: string;
  shouldFail?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (password: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (shouldFail) {
      throw new Error('Contraseña incorrecta. Por favor intenta nuevamente.');
    }

    // Success case
    // eslint-disable-next-line no-console
    console.log('Password submitted:', password);
    setIsOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
      >
        Open Modal
      </button>

      <PasswordPromptModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        userHasColombianId={userHasColombianId}
        fileName={fileName}
      />
    </div>
  );
}

/**
 * User with Colombian ID configured - will show hint message
 */
export const WithColombianId: Story = {
  args: {
    isOpen: true,
    userHasColombianId: true,
    fileName: 'extracto_bancario_2024.xlsx',
    onClose: () => {},
    onSubmit: async () => {},
  },
  render: () => (
    <InteractiveWrapper userHasColombianId={true} fileName="extracto_bancario_2024.xlsx" />
  ),
};

/**
 * User without Colombian ID - shows "Complete Profile" banner
 */
export const WithoutColombianId: Story = {
  args: {
    isOpen: true,
    userHasColombianId: false,
    fileName: 'transacciones_enero.xlsx',
    onClose: () => {},
    onSubmit: async () => {},
  },
  render: () => (
    <InteractiveWrapper userHasColombianId={false} fileName="transacciones_enero.xlsx" />
  ),
};

/**
 * Error state - simulates incorrect password
 */
export const WithError: Story = {
  args: {
    isOpen: true,
    userHasColombianId: true,
    fileName: 'datos_protegidos.xlsx',
    onClose: () => {},
    onSubmit: async () => {},
  },
  render: () => (
    <InteractiveWrapper
      userHasColombianId={true}
      fileName="datos_protegidos.xlsx"
      shouldFail={true}
    />
  ),
};

/**
 * Long filename to test overflow handling
 */
export const LongFileName: Story = {
  args: {
    isOpen: true,
    userHasColombianId: true,
    fileName:
      'extracto_bancario_completo_de_todas_las_cuentas_y_tarjetas_enero_diciembre_2024.xlsx',
    onClose: () => {},
    onSubmit: async () => {},
  },
  render: () => (
    <InteractiveWrapper
      userHasColombianId={true}
      fileName="extracto_bancario_completo_de_todas_las_cuentas_y_tarjetas_enero_diciembre_2024.xlsx"
    />
  ),
};

/**
 * Default state with short filename
 */
export const Default: Story = {
  args: {
    isOpen: true,
    userHasColombianId: true,
    fileName: 'datos.xlsx',
    onClose: () => {},
    onSubmit: async () => {},
  },
  render: () => <InteractiveWrapper userHasColombianId={true} fileName="datos.xlsx" />,
};
