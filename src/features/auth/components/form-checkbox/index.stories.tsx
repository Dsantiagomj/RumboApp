import type { Meta, StoryObj } from '@storybook/react';
import { FormCheckbox } from './index';

const meta = {
  title: 'Auth/Form Inputs/FormCheckbox',
  component: FormCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'terms',
    label: 'I accept the terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    id: 'terms',
    label: 'I accept the terms and conditions',
    checked: true,
  },
};

export const WithError: Story = {
  args: {
    id: 'terms',
    label: 'I accept the terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

export const Disabled: Story = {
  args: {
    id: 'terms',
    label: 'I accept the terms and conditions',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    id: 'terms',
    label: 'I accept the terms and conditions',
    disabled: true,
    checked: true,
  },
};

export const WithLink: Story = {
  args: {
    id: 'terms',
    label: (
      <>
        I accept the{' '}
        <a href="/terms" className="text-primary hover:underline">
          Terms and Conditions
        </a>
      </>
    ),
  },
};

export const Newsletter: Story = {
  args: {
    id: 'newsletter',
    label: 'Subscribe to our newsletter for updates',
  },
};
