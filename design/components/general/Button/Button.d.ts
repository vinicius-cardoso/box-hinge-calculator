import * as React from 'react';

/**
 * Button — from @box-hinge/blueprint-design-system@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** "primary" = ação principal (verde preenchido); "secondary" = outline. */
  variant?: "primary" | "secondary";
}

export declare const Button: React.ComponentType<ButtonProps>;
