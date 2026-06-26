import React from "react";

export type BadgeProps = {
  children: React.ReactNode;
  /** "outline" (padrão), "solid" (estado afirmativo, ex.: VIÁVEL), "dashed" (opcional). */
  variant?: "outline" | "solid" | "dashed";
};

/** Chip/badge mono Blueprint. */
export function Badge({ children, variant = "outline" }: BadgeProps) {
  const cls = [
    "ds-badge",
    variant === "solid" ? "ds-badge--solid" : "",
    variant === "dashed" ? "ds-badge--dashed" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return <span className={cls}>{children}</span>;
}
