/* ui-components.jsx — peças de UI compostas sobre o Design System "Blueprint".
   Camada React global (Babel). Exporta para window no final. */

const { Panel, NumberField, Badge, Button, TitleBlock, Dimension } = window.BlueprintDS;

/* ParamGroup — grupo de parâmetros colapsável, no visual do DS (ds-panel). */
function ParamGroup({ title, tag, defaultOpen = true, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="ds-panel" style={{ marginBottom: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="ds-panel__head"
        style={{
          width: "100%", border: 0, cursor: "pointer", textAlign: "left",
          background: "var(--ds-panel)", borderBottom: open ? "1px solid var(--ds-line)" : "0",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              fontFamily: "var(--ds-mono)", fontSize: 11, color: "var(--ds-green)",
              transition: "transform .18s", transform: open ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block", width: 10,
            }}
          >
            ▸
          </span>
          <span className="ds-panel__title">{title}</span>
        </span>
        <span className="ds-panel__tag">{tag}</span>
      </button>
      {open && <div className="ds-panel__body">{children}</div>}
    </div>
  );
}

/* SliderRow — campo numérico DIGITÁVEL (texto livre, confirma no blur/Enter) +
   slider. Arredonda ao passo e faz clamp só ao confirmar, para permitir digitar
   valores multi-dígito como "65" ou "16.2". Validação inline opcional. */
function SliderRow({ label, value, unit = "mm", min, max, step = 1, onChange, locked, error, hint }) {
  const [text, setText] = React.useState(String(Number(value.toFixed(2))));
  React.useEffect(() => { setText(String(Number(value.toFixed(2)))); }, [value]);

  const commit = () => {
    if (locked || !onChange) return;
    let n = Number(String(text).replace(",", "."));
    if (Number.isNaN(n)) { setText(String(Number(value.toFixed(2)))); return; }
    n = Math.max(min, Math.min(max, n));
    n = Number((Math.round(n / step) * step).toFixed(2));
    onChange(n);
    setText(String(n));
  };
  const slide = (v) => {
    if (locked || !onChange) return;
    onChange(Number((Math.round(Number(v) / step) * step).toFixed(2)));
  };

  return (
    <div style={{ opacity: locked ? 0.72 : 1 }}>
      <div className="ds-field">
        <label className="ds-field__label">
          {locked ? `${label} · travado` : label} <b>{Number(value.toFixed(2))} {unit}</b>
        </label>
        <div className="ds-field__inp">
          <input
            type="text" inputMode="decimal" value={text} disabled={locked}
            aria-label={label}
            onChange={(e) => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            style={{ flex: 1, background: "transparent", border: 0, color: "var(--ds-ink)", fontFamily: "var(--ds-mono)", fontSize: 14, padding: "9px 11px", width: "100%", outline: "none" }}
          />
          <span className="ds-field__unit">{unit}</span>
        </div>
      </div>
      {!locked && (
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => slide(e.target.value)} aria-label={label}
          style={{ width: "100%", marginTop: 6, accentColor: "#5ebe83", cursor: "ew-resize" }}
        />
      )}
      {error && (
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10.5, color: "#e0a04a", marginTop: 5, letterSpacing: ".02em" }}>
          ▲ {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", marginTop: 4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ParamGroup, SliderRow });
