/**
 * Document Type Selector Types
 */

export type DocumentType = 'CC' | 'CE' | 'PASAPORTE';

export interface DocumentTypeSelectorProps {
  value: DocumentType | '';
  onChange: (type: DocumentType) => void;
  disabled?: boolean;
}
