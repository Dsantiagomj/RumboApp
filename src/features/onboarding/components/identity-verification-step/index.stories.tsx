import type { Meta, StoryObj } from '@storybook/react';
import { IdentityVerificationStep } from './index';

const meta = {
  title: 'Onboarding/IdentityVerificationStep',
  component: IdentityVerificationStep,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IdentityVerificationStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Identity verification submitted:', data),
    onBack: () => console.log('Back button clicked'),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Identity verification submitted:', data),
    onBack: () => console.log('Back button clicked'),
    isLoading: true,
  },
};

export const WithoutBackButton: Story = {
  args: {
    onSubmit: (data) => console.log('Identity verification submitted:', data),
    isLoading: false,
  },
};

export const WithDefaultValues: Story = {
  args: {
    onSubmit: (data) => console.log('Identity verification submitted:', data),
    onBack: () => console.log('Back button clicked'),
    isLoading: false,
    defaultValues: {
      documentType: 'CC',
      documentNumber: '1234567890',
    },
  },
};
