import type { Meta, StoryObj } from '@storybook/react';
import { PersonalInfoStep } from './index';

const meta = {
  title: 'Onboarding/PersonalInfoStep',
  component: PersonalInfoStep,
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
} satisfies Meta<typeof PersonalInfoStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Personal info submitted:', data),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Personal info submitted:', data),
    isLoading: true,
  },
};

export const WithDefaultValues: Story = {
  args: {
    onSubmit: (data) => console.log('Personal info submitted:', data),
    isLoading: false,
    defaultValues: {
      dateOfBirth: new Date('1990-01-15'),
      phoneNumber: '+57 300 123 4567',
    },
  },
};
