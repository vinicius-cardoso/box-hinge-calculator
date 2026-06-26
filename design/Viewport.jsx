/* Viewport.jsx — viewport 3D dominante + chrome de desenho técnico
   (marcas de canto, crosshair) e barra de controle (abertura / auto-rotação).
   Fala com o motor 3D via window.HingeEngine (API imperativa). */

const { Badge } = window.BlueprintDS;

function CornerBrackets() {
  const c = "var(--ds-line-2)";
  const L = 22, T = 1.5;
  const base = { position: "absolute", pointerEvents: "none" };
  const h = { ...base, width: L, height: T, background: c };
  const v = { ...base, width: T, height: L, background: c };
  const m = 14;
  return (
    <React.Fragment>
      <div style={{ ...h, left: m, top: m }} /><div style={{ ...v, left: m, top: m }} />
      <div style={{ ...h, right: m, top: m }} /><div style={{ ...v, right: m, top: m }} />
      <div style={{ ...h, left: m, bottom: m }} /><div style={{ ...v, left: m, bottom: m }} />
      <div style={{ ...h, right: m, bottom: m }} /><div style={{ ...v, right: m, bottom: m }} />
    </React.Fragment>
  );
}

function Crosshair() {
  const c = "rgba(94,190,131,0.28)";
  const line = { position: "absolute", background: c, pointerEvents: "none" };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ ...line, left: "50%", top: "calc(50% - 26px)", width: 1, height: 16, transform: "translateX(-50%)" }} />
      <div style={{ ...line, left: "50%", top: "calc(50% + 10px)", width: 1, height: 16, transform: "translateX(-50%)" }} />
      <div style={{ ...line, top: "50%", left: "calc(50% - 26px)", height: 1, width: 16, transform: "translateY(-50%)" }} />
      <div style={{ ...line, top: "50%", left: "calc(50% + 10px)", height: 1, width: 16, transform: "translateY(-50%)" }} />
    </div>
  );
}

function Viewport({ params, solution, openT, autoRotate, onOpenChange, onToggleOpen, onAutoRotate, onReset, feasible, solving }) {
  const mountRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const animRef = React.useRef(null);

  // cria a cena uma vez (espera o motor ESM ficar pronto)
  React.useEffect(() => {
    let cancelled = false;
    function boot() {
      if (cancelled || !mountRef.current || sceneRef.current) return;
      if (!window.HingeEngine) { setTimeout(boot, 40); return; }
      sceneRef.current = window.HingeEngine.createScene(mountRef.current);
      sceneRef.current.setModel(params, solution);
      sceneRef.current.setOpen(openT / 100);
      sceneRef.current.setAutoRotate(autoRotate);
    }
    boot();
    return () => { cancelled = true; if (sceneRef.current) { sceneRef.current.dispose(); sceneRef.current = null; } };
    // eslint-disable-next-line
  }, []);

  // reconstrói geometria quando params OU a solução do backend mudam
  React.useEffect(() => { if (sceneRef.current) sceneRef.current.setModel(params, solution); }, [params, solution]);
  // atualiza abertura
  React.useEffect(() => { if (sceneRef.current) sceneRef.current.setOpen(openT / 100); }, [openT]);
  // auto-rotação
  React.useEffect(() => { if (sceneRef.current) sceneRef.current.setAutoRotate(autoRotate); }, [autoRotate]);

  // expõe reset para o pai
  React.useEffect(() => {
    if (onReset) onReset.current = () => sceneRef.current && sceneRef.current.resetView();
  }, [onReset]);

  const openAngleNow = ((openT / 100) * 90).toFixed(0);   // abertura 100% = vertical (90°)

  const ctrlBtn = {
    fontFamily: "var(--ds-display)", textTransform: "uppercase", letterSpacing: ".06em",
    fontSize: 12, padding: "7px 12px", border: "1px solid var(--ds-line-2)",
    background: "rgba(15,21,24,0.7)", color: "var(--ds-ink)", cursor: "pointer", borderRadius: 0,
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      {/* chrome técnico */}
      <CornerBrackets />
      <Crosshair />

      {/* etiqueta de vista (canto sup-esq) */}
      <div style={{ position: "absolute", left: 22, top: 24, pointerEvents: "none" }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, letterSpacing: ".2em", color: "var(--ds-green)" }}>VIEWPORT</div>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", marginTop: 3 }}>PROJ ISO · TURNTABLE Y</div>
      </div>

      {/* estado de viabilidade (canto sup-dir) */}
      <div style={{ position: "absolute", right: 22, top: 22 }}>
        <Badge variant={feasible ? "solid" : "dashed"}>
          {feasible ? "● VIÁVEL" : "▲ INTERFERÊNCIA"}
        </Badge>
      </div>

      {/* leitura de abertura (canto inf-esq) */}
      <div style={{ position: "absolute", left: 22, bottom: 70, pointerEvents: "none" }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: "var(--ds-dim)" }}>
          θ {openAngleNow}° <span style={{ color: "var(--ds-faint)" }}>/ 90° (vertical)</span>
        </div>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", marginTop: 2 }}>
          ABERTURA {openT.toFixed(0)}%
        </div>
      </div>

      {/* barra de controle inferior */}
      <div
        style={{
          position: "absolute", left: 14, right: 14, bottom: 14, display: "flex", alignItems: "center",
          gap: 14, padding: "9px 14px", background: "rgba(18,26,30,0.82)",
          border: "1px solid var(--ds-line)", backdropFilter: "blur(4px)",
        }}
      >
        <button style={ctrlBtn} onClick={onToggleOpen}>{openT > 50 ? "Fechar" : "Abrir"}</button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 11 }}>
          <span style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", whiteSpace: "nowrap" }}>FECH</span>
          <input
            type="range" min={0} max={100} step={1} value={openT}
            onChange={(e) => onOpenChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#5ebe83", cursor: "ew-resize" }}
          />
          <span style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", whiteSpace: "nowrap" }}>ABERT</span>
        </div>
        <button
          style={{ ...ctrlBtn, color: autoRotate ? "var(--ds-green-bright)" : "var(--ds-muted)", borderColor: autoRotate ? "var(--ds-green-dim)" : "var(--ds-line-2)" }}
          onClick={() => onAutoRotate(!autoRotate)}
        >
          {autoRotate ? "● Rot Auto" : "○ Rot Auto"}
        </button>
        <button style={ctrlBtn} onClick={() => onReset && onReset.current && onReset.current()}>Vista</button>
      </div>
    </div>
  );
}

Object.assign(window, { Viewport });
