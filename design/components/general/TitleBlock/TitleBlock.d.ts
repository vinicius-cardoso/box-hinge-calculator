import * as React from 'react';

/**
 * TitleBlock — from @box-hinge/blueprint-design-system@0.1.0.
 */
export interface TitleBlockProps {
  eyebrow?: string;
  /** título; use <em> via children para destacar parte em verde. */
  children: React.ReactNode;
  /** células de metadados à direita (ex.: Scale 1:1, Units mm, Rev A). */
  cells?: TitleBlockCell[];
}

export declare const TitleBlock: React.ComponentType<TitleBlockProps>;
