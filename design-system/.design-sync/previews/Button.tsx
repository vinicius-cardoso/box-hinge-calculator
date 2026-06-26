import React from "react";
import { Button } from "@box-hinge/blueprint-design-system";

export const Primario = () => <Button variant="primary">Exportar STEP</Button>;

export const Secundario = () => <Button variant="secondary">Exportar STL</Button>;

export const Desabilitado = () => (
  <Button variant="primary" disabled>
    Exportar STEP
  </Button>
);
