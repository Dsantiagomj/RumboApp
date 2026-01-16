import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { AccountType } from '@prisma/client';
import { AccountTypeSelector } from './index';

const meta = {
  title: 'Account/AccountTypeSelector',
  component: AccountTypeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountTypeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper to manage state
function InteractiveAccountTypeSelector() {
  const [selectedType, setSelectedType] = useState<AccountType | undefined>();

  return (
    <div className="space-y-4">
      <AccountTypeSelector value={selectedType} onChange={setSelectedType} />
      <div className="text-muted-foreground text-center text-sm">
        Selected: {selectedType || 'None'}
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    value: undefined,
    onChange: (type) => console.log('Selected:', type),
  },
  render: () => <InteractiveAccountTypeSelector />,
};

export const WithPreselection: Story = {
  args: {
    value: 'SAVINGS',
    onChange: (type) => console.log('Selected:', type),
  },
};

export const CreditCard: Story = {
  args: {
    value: 'CREDIT_CARD',
    onChange: (type) => console.log('Selected:', type),
  },
};

export const Investment: Story = {
  args: {
    value: 'INVESTMENT',
    onChange: (type) => console.log('Selected:', type),
  },
};
