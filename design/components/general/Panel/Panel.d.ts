import * as React from 'react';

/**
 * Panel — from @box-hinge/blueprint-design-system@0.1.0.
 */
export interface PanelProps {
  title: string;
  /** etiqueta mono à direita do cabeçalho (ex.: nome técnico). */
  tag?: string;
  children?: React.ReactNode;
}

export declare const Panel: React.ComponentType<PanelProps>;
