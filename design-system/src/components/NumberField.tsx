import React from "react";

export type NumberFieldProps = {
  label: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

/**
 * Campo de parâmetro Blueprint: rótulo + valor mono à direita, input com sufixo de
 * unidade e um trilho fino mostrando a posição entre min/max.
 */
export function NumberField({ label, value, unit = "mm", min = 0, max = 100, onChange }: NumberFieldProps) {
  const pct = max > min ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)) : 0;
  return (
    <div className="ds-field">
      <label className="ds-field__label">
        {label} <b>{value} {unit}</b>
      </label>
      <div className="ds-field__inp">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          aria-label={label}
          onChange={(e) => onChange?.(Number(e.target.value))}
        />
        <span className="ds-field__unit">{unit}</span>
      </div>
      <div className="ds-field__track">
        <span className="ds-field__fill" style={{ width: `${pct}%` }} />
        <span className="ds-field__thumb" style={{ left: `${pct}%` }} />
      </div>
    </div>
  );
}
