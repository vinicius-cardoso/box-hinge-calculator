/* App.jsx — composição final do Box Hinge Calculator.
   Parâmetros (compartilhados caixa⇄tampa), solve AUTORITATIVO no backend (debounced),
   exportações STEP/STL via backend, viabilidade e layout. */

const { TitleBlock, Badge, Button, Dimension } = window.BlueprintDS;

const DEFAULTS = {
  units: "mm",
  shared: { width: 60, length: 30, wallThickness: 1.2, holeDiameter: 2, panelThickness: 1.2 },
  box: { height: 16.2 },
  lid: { height: 6.2 },
  bars: { width: 4.8, pegDiameter: 2 },
  hinge: { openGap: 2 },
};

const LS = { params: "bhc.params3", open: "bhc.openT", rot: "bhc.autoRotate" };
const loadLS = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };

/* Validação local (impossibilidades físicas). */
const MIN_WALL = 0.8;
function validate(p) {
  const er = {};
  const s = p.shared;
  if (s.wallThickness < MIN_WALL) er["shared.wallThickness"] = `mínimo ${MIN_WALL} mm`;
  if (s.panelThickness < MIN_WALL) er["shared.panelThickness"] = `mínimo ${MIN_WALL} mm`;
  if (2 * s.wallThickness >= s.width) er["shared.wallThickness"] = "paredes ≥ largura";
  if (2 * s.wallThickness >= s.length) er["shared.wallThickness"] = "paredes ≥ comprimento";
  if (s.panelThickness >= p.box.height) er["shared.panelThickness"] = "painel ≥ altura da caixa";
  if (s.holeDiameter >= p.box.height) er["shared.holeDiameter"] = "furo ≥ altura";
  if (p.bars.pegDiameter > p.bars.width + 1e-9) er["bars.width"] = "barra mais estreita que o furo";
  return er;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
}

function App() {
  const [params, setParams] = React.useState(() => loadLS(LS.params, DEFAULTS));
  const [openT, setOpenT] = React.useState(() => loadLS(LS.open, 0));
  const [autoRotate, setAutoRotate] = React.useState(() => loadLS(LS.rot, true));
  const [solution, setSolution] = React.useState(null);
  const [solving, setSolving] = React.useState(false);
  const [solveErr, setSolveErr] = React.useState(null);
  const [busy, setBusy] = React.useState("");        // "" | "stl" | "step"
  const resetRef = React.useRef(null);
  const animRef = React.useRef(null);
  const debRef = React.useRef(null);

  React.useEffect(() => { localStorage.setItem(LS.params, JSON.stringify(params)); }, [params]);
  React.useEffect(() => { localStorage.setItem(LS.open, JSON.stringify(openT)); }, [openT]);
  React.useEffect(() => { localStorage.setItem(LS.rot, JSON.stringify(autoRotate)); }, [autoRotate]);

  const errors = React.useMemo(() => validate(params), [params]);

  // SOLVE autoritativo no backend (debounced). Mantém a última solução durante o recálculo.
  React.useEffect(() => {
    if (Object.keys(errors).length) { setSolveErr(null); return; }
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      if (!window.HingeEngine) return;
      setSolving(true); setSolveErr(null);
      try {
        const sol = await window.HingeEngine.solveRemote(params);
        setSolution(sol);
      } catch (e) {
        setSolveErr("backend indisponível — inicie o servidor (uvicorn) na porta 8000");
      } finally { setSolving(false); }
    }, 600);
    return () => debRef.current && clearTimeout(debRef.current);
  }, [params, errors]);

  const feasible = !!(solution && solution.feasible) && Object.keys(errors).length === 0;

  // dica acionável quando inviável (req 7)
  const infeasHint = (() => {
    if (solveErr || solving) return null;
    if (Object.keys(errors).length) return "corrija os campos destacados em vermelho.";
    if (solution && !solution.feasible) {
      return (solution.warnings && solution.warnings.length)
        ? "para tornar viável: " + solution.warnings.join(" · ")
        : "sem solução sem colisão — tente aumentar a folga, aumentar a altura da tampa ou reduzir o Ø dos furos.";
    }
    return null;
  })();

  const onChange = (group, key, value) => {
    setParams((prev) => {
      const next = { ...prev, [group]: { ...prev[group], [key]: value } };
      // press-fit: Ø do encaixe SEMPRE igual ao Ø do furo
      if (group === "shared" && key === "holeDiameter") {
        next.bars = { ...next.bars, pegDiameter: value };
      }
      return next;
    });
  };

  const animateTo = (target) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = openT, t0 = performance.now(), dur = 1200;
    const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      setOpenT(start + (target - start) * ease(k));
      if (k < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  };
  const toggleOpen = () => animateTo(openT > 50 ? 0 : 100);

  const doExport = async (fmt) => {
    if (!window.HingeEngine || !feasible) return;
    setBusy(fmt);
    try {
      const blob = await window.HingeEngine.exportFile(params, fmt);
      downloadBlob(blob, `caixa_dobradica.${fmt}`);
    } catch (e) { setSolveErr(`falha ao exportar ${fmt.toUpperCase()} (backend?)`); }
    setBusy("");
  };

  const fmt = (n) => Number(n).toFixed(1);
  const stateLabel = solveErr ? "▲ SEM BACKEND" : solving ? "⟳ RECALCULANDO" : feasible ? "● VIÁVEL" : "▲ INVIÁVEL";
  const stateVar = feasible && !solving && !solveErr ? "solid" : "dashed";

  return (
    <div className="ds-surface bhc-root">
      <header className="bhc-header">
        <div style={{ flex: 1, minWidth: 280 }}>
          <TitleBlock
            eyebrow="Blueprint · DWG-01 · 4-barras (Burmester)"
            cells={[{ k: "Scale", v: "1:1" }, { k: "Units", v: "mm" }, { k: "Rev", v: "B" }]}
          >
            Box <em>Hinge</em> Calculator
          </TitleBlock>
        </div>
        <div className="bhc-actions">
          <Badge variant={stateVar}>{stateLabel}</Badge>
          <Button variant="secondary" onClick={() => doExport("stl")} disabled={!feasible || busy}>
            {busy === "stl" ? "Gerando…" : "Exportar STL"}
          </Button>
          <Button variant="primary" onClick={() => doExport("step")} disabled={!feasible || busy}>
            {busy === "step" ? "Gerando…" : "Exportar STEP"}
          </Button>
        </div>
      </header>

      <main className="bhc-main">
        <section className="bhc-viewport">
          <Viewport
            params={params}
            solution={solution}
            openT={openT}
            autoRotate={autoRotate}
            feasible={feasible}
            solving={solving}
            onOpenChange={(v) => { if (animRef.current) cancelAnimationFrame(animRef.current); setOpenT(v); }}
            onToggleOpen={toggleOpen}
            onAutoRotate={setAutoRotate}
            onReset={resetRef}
          />
        </section>

        <aside className="bhc-panel">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 2 }}>
            {[["L", params.shared.width], ["C", params.shared.length], ["H", params.box.height]].map(([k, v]) => (
              <div key={k}>
                <Dimension label={fmt(v)} />
                <div style={{ textAlign: "center", fontFamily: "var(--ds-mono)", fontSize: 9, color: "var(--ds-faint)", marginTop: 2 }}>{k} · mm</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
            <Badge variant="outline">furo Ø{fmt(params.shared.holeDiameter)} = encaixe (press-fit)</Badge>
            {solution && solution.barLengths && (
              <Badge variant="outline">barras {solution.barLengths.map((b) => fmt(b)).join(" · ")} mm</Badge>
            )}
            <Badge variant="outline">gap {fmt(params.hinge.openGap)} mm</Badge>
          </div>

          {(solveErr || infeasHint) && (
            <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: "#e0a04a", border: "1px solid #e0a04a55", background: "#e0a04a14", padding: "8px 10px", lineHeight: 1.5 }}>
              {solveErr || <span><b>▲ Inviável.</b> {infeasHint}</span>}
            </div>
          )}

          <ControlsPanel params={params} errors={errors} onChange={onChange} />

          <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: "var(--ds-faint)", lineHeight: 1.6, paddingTop: 4 }}>
            Síntese de Burmester (4 poses) e geometria STEP/STL resolvidas no backend
            <span style={{ color: "var(--ds-dim)" }}> /solve · /export</span>. Preview anima localmente.
          </div>
        </aside>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
