import React from "react";

export type DimensionProps = {
  /** texto da cota, ex.: "62.0" ou "Ø2.0 H7". */
  label: string;
};

/** Linha de cota Blueprint (ticks nas pontas + setas), para comunicar medidas. */
export function Dimension({ label }: DimensionProps) {
  return (
    <div className="ds-dim">
      <span className="ds-dim__label">{label}</span>
      <div className="ds-dim__line">
        <span className="ds-dim__tick" />
        <span className="ds-dim__rule" />
        <span className="ds-dim__tick" />
      </div>
    </div>
  );
}
