import React from "react";
import { NumberField } from "@box-hinge/blueprint-design-system";

export const Largura = () => (
  <div style={{ width: 280 }}>
    <NumberField label="Largura" value={62} unit="mm" min={20} max={200} />
  </div>
);

export const FolgaAberta = () => (
  <div style={{ width: 280 }}>
    <NumberField label="Folga aberta" value={2} unit="mm" min={0} max={10} />
  </div>
);
