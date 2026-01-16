# AccountTypeSelector Component

A visual card selector component for choosing account types with animated interactions.

## Features

- **6 Account Types**: Displays SAVINGS, CHECKING, CREDIT_CARD, LOAN, CASH, and INVESTMENT options
- **Responsive Grid**: 2 columns on mobile, 3 columns on desktop
- **Framer Motion Animations**:
  - Hover/tap scale effects (1.02 / 0.98)
  - Selected indicator with `layoutId="selected-type"` for smooth transitions
  - Animated checkmark on selection
- **Visual Feedback**:
  - Colored icons in circles
  - Spanish labels with descriptions
  - Border and background color changes on selection

## Usage

```tsx
import { AccountTypeSelector } from '@/features/account/components/account-type-selector';
import { useState } from 'react';
import type { AccountType } from '@prisma/client';

function MyComponent() {
  const [accountType, setAccountType] = useState<AccountType>();

  return <AccountTypeSelector value={accountType} onChange={setAccountType} />;
}
```

## Props

| Prop       | Type                          | Required | Description                               |
| ---------- | ----------------------------- | -------- | ----------------------------------------- |
| `value`    | `AccountType \| undefined`    | No       | Currently selected account type           |
| `onChange` | `(type: AccountType) => void` | Yes      | Callback when an account type is selected |

## Account Types

| Type          | Label (Spanish)    | Icon       | Color       |
| ------------- | ------------------ | ---------- | ----------- |
| `SAVINGS`     | Ahorros            | PiggyBank  | green-500   |
| `CHECKING`    | Corriente          | Building   | blue-500    |
| `CREDIT_CARD` | Tarjeta de Crédito | CreditCard | purple-500  |
| `LOAN`        | Préstamo           | TrendingUp | orange-500  |
| `CASH`        | Efectivo           | DollarSign | emerald-500 |
| `INVESTMENT`  | Inversión          | Wallet     | indigo-500  |

## Storybook

View the component in Storybook:

```bash
npm run storybook
```

Navigate to: `Account/AccountTypeSelector`
