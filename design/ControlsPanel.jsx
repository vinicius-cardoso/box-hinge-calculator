/* ControlsPanel.jsx — painel lateral de parâmetros, em grupos colapsáveis.
   Compartilhados entre caixa e tampa: largura, comprimento, paredes, furo, painel.
   Próprio de cada um: só a ALTURA. Encaixe das barras = Ø do furo (press-fit). */

function ControlsPanel({ params, errors, onChange }) {
  const set = (group, key) => (v) => onChange(group, key, v);
  const e = (k) => errors[k];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ParamGroup title="Compartilhado" tag="shared · caixa ⇄ tampa">
        <SliderRow label="Largura" value={params.shared.width} min={20} max={200} step={0.4}
          onChange={set("shared", "width")} error={e("shared.width")} />
        <SliderRow label="Comprimento" value={params.shared.length} min={20} max={200} step={0.4}
          onChange={set("shared", "length")} error={e("shared.length")} />
        <SliderRow label="Esp. das paredes" value={params.shared.wallThickness} min={0.8} max={10} step={0.4}
          onChange={set("shared", "wallThickness")} error={e("shared.wallThickness")} hint="mínimo 0,8 mm" />
        <SliderRow label="Ø dos furos" value={params.shared.holeDiameter} min={0.8} max={8} step={0.4}
          onChange={set("shared", "holeDiameter")} error={e("shared.holeDiameter")}
          hint="furo passante; o encaixe das barras acompanha (press-fit)" />
        <SliderRow label="Esp. do painel" value={params.shared.panelThickness} min={0.8} max={8} step={0.4}
          onChange={set("shared", "panelThickness")} error={e("shared.panelThickness")}
          hint="fundo da caixa = topo da tampa" />
      </ParamGroup>

      <ParamGroup title="Caixa" tag="box · altura própria">
        <SliderRow label="Altura" value={params.box.height} min={6} max={140} step={0.4}
          onChange={set("box", "height")} error={e("box.height")} />
      </ParamGroup>

      <ParamGroup title="Tampa" tag="lid · altura própria">
        <SliderRow label="Altura" value={params.lid.height} min={3} max={80} step={0.4}
          onChange={set("lid", "height")} error={e("lid.height")}
          hint="empilhada em cima da caixa" />
      </ParamGroup>

      <ParamGroup title="Barras" tag="bars · espessura = parede">
        <SliderRow label="Largura" value={params.bars.width} min={2} max={14} step={0.4}
          onChange={set("bars", "width")} error={e("bars.width")} hint="raio do arco = largura ÷ 2" />
        <SliderRow label="Ø do encaixe" value={params.bars.pegDiameter} min={0.8} max={8} step={0.4}
          locked hint={`travado = Ø furos (press-fit · Ø${Number(params.shared.holeDiameter).toFixed(1)})`} />
      </ParamGroup>

      <ParamGroup title="Dobradiça" tag="hinge · 100% = vertical">
        <SliderRow label="Folga aberta" value={params.hinge.openGap} min={0} max={12} step={0.4}
          onChange={set("hinge", "openGap")} error={e("hinge.openGap")}
          hint="distância tampa↔caixa com a tampa vertical" />
      </ParamGroup>
    </div>
  );
}

Object.assign(window, { ControlsPanel });
