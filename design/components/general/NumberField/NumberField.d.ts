import * as React from 'react';

/**
 * NumberField — from @box-hinge/blueprint-design-system@0.1.0.
 */
export interface NumberFieldProps {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export declare const NumberField: React.ComponentType<NumberFieldProps>;
