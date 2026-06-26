import React from "react";

export type TitleBlockCell = { k: string; v: string };

export type TitleBlockProps = {
  eyebrow?: string;
  /** título; use <em> via children para destacar parte em verde. */
  children: React.ReactNode;
  /** células de metadados à direita (ex.: Scale 1:1, Units mm, Rev A). */
  cells?: TitleBlockCell[];
};

/** Cabeçalho em "bloco de título" de desenho técnico. */
export function TitleBlock({ eyebrow, children, cells = [] }: TitleBlockProps) {
  return (
    <header className="ds-titleblock">
      <div className="ds-titleblock__main">
        {eyebrow ? <span className="ds-titleblock__eyebrow">{eyebrow}</span> : null}
        <h1 className="ds-titleblock__title">{children}</h1>
      </div>
      {cells.map((c) => (
        <div className="ds-titleblock__cell" key={c.k}>
          <span className="ds-titleblock__k">{c.k}</span>
          <span className="ds-titleblock__v">{c.v}</span>
        </div>
      ))}
    </header>
  );
}
