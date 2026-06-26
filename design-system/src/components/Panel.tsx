import React from "react";

export type PanelProps = {
  title: string;
  /** etiqueta mono à direita do cabeçalho (ex.: nome técnico). */
  tag?: string;
  children?: React.ReactNode;
};

/** Painel Blueprint com cabeçalho em bloco de título. */
export function Panel({ title, tag, children }: PanelProps) {
  return (
    <section className="ds-panel">
      <header className="ds-panel__head">
        <span className="ds-panel__title">{title}</span>
        {tag ? <span className="ds-panel__tag">{tag}</span> : null}
      </header>
      <div className="ds-panel__body">{children}</div>
    </section>
  );
}
