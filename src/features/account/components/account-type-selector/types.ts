/**
 * Account Type Selector Types
 */

import type { AccountType } from '@prisma/client';

export interface AccountTypeSelectorProps {
  value?: AccountType;
  onChange: (type: AccountType) => void;
}

export type { AccountType };
