import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** "primary" = ação principal (verde preenchido); "secondary" = outline. */
  variant?: "primary" | "secondary";
};

/** Botão Blueprint — maiúsculas em ISOCPEUR, cantos retos. */
export function Button({ variant = "secondary", className = "", ...rest }: ButtonProps) {
  const cls = ["ds-btn", variant === "primary" ? "ds-btn--primary" : "", className]
    .filter(Boolean)
    .join(" ");
  return <button className={cls} {...rest} />;
}
