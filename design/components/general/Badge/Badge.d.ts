import * as React from 'react';

/**
 * Badge — from @box-hinge/blueprint-design-system@0.1.0.
 */
export interface BadgeProps {
  children: React.ReactNode;
  /** "outline" (padrão), "solid" (estado afirmativo, ex.: VIÁVEL), "dashed" (opcional). */
  variant?: "outline" | "solid" | "dashed";
}

export declare const Badge: React.ComponentType<BadgeProps>;
