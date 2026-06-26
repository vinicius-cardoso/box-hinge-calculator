import React from "react";
import { TitleBlock } from "@box-hinge/blueprint-design-system";

export const Padrao = () => (
  <div style={{ width: 460 }}>
    <TitleBlock
      eyebrow="Design System · DWG-01"
      cells={[
        { k: "Scale", v: "1:1" },
        { k: "Units", v: "mm" },
        { k: "Rev", v: "A" },
      ]}
    >
      Box <em>Hinge</em> Calculator
    </TitleBlock>
  </div>
);
