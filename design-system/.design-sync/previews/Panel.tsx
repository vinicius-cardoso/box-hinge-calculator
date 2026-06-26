import React from "react";
import { Panel, NumberField, Button } from "@box-hinge/blueprint-design-system";

export const ParametrosDaCaixa = () => (
  <div style={{ width: 300 }}>
    <Panel title="Caixa" tag="box">
      <NumberField label="Largura" value={62} unit="mm" min={20} max={200} />
      <NumberField label="Altura" value={22} unit="mm" min={5} max={120} />
      <Button variant="primary">Exportar STEP</Button>
    </Panel>
  </div>
);
