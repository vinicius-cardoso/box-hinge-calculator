# Prompt para o Claude Design

> Cole o bloco abaixo no Claude Design. **Dica:** anexe também as duas imagens de
> referência (`img/caixa_fechada.png` e `img/caixa_aberta.png`) para o estilo do
> mecanismo ficar fiel.

---

Crie um web app de página única, **visualmente deslumbrante e técnico**, chamado
**"Box Hinge Calculator"**. É uma ferramenta paramétrica de CAD para projetar uma
**caixa com tampa e dobradiça de 4 barras** (problema "box lid with 4-bar hinge"): o
usuário ajusta dimensões e vê a caixa renderizada em 3D, girando lentamente, abrindo
sem que a tampa colida com a caixa.

## Stack
- **React + TypeScript**.
- **Three.js via `@react-three/fiber` + `@react-three/drei`** para a cena 3D.
- Estado simples com `useState`/`useReducer`. Sem backend nesta etapa (deixe ganchos
  para plugar uma API depois).

## Identidade visual — Design System "Blueprint"
**Use o Design System "Blueprint" já selecionado** e monte a interface com os seus
componentes: **TitleBlock** (cabeçalho/bloco de título), **Panel** (grupos de parâmetros),
**NumberField** (cada parâmetro numérico), **Button** (exportar STEP/STL), **Badge**
(estado, ex.: "VIÁVEL"), **Dimension** (cotas). Envolva a página na classe `.ds-surface`.
Referência dos tokens (já no design system):
- Fundo grafite `#0F1518` com **grade técnica sutil sempre visível** (quadriculado 20px
  + linhas mestras 100px). Superfícies `#16201F`, bordas hairline `#243036`.
- Acento **verde** `#5EBE83` (brilho `#84DBA6`) — só para ação/estado/destaque, nunca
  preenchendo grandes áreas. Texto `#DCE8E4`, secundário `#7E8C88`.
- **Cantos retos (border-radius 0) em tudo.**
- Tipografia: títulos/rótulos/botões em **ISOCPEUR** (embutida, MAIÚSCULAS); corpo em
  fonte de sistema; **todos os números, valores e cotas em monoespaçada com unidade**
  (`62.0 mm`, `Ø2.0`, `θ110°`).
- Motivos de desenho técnico: **bloco de título** no cabeçalho (nome + Scale 1:1 / Units
  mm / Rev A), **marcas de canto em colchete** e **crosshair** no viewport, **linhas de
  cota** com ticks para comunicar medidas.

## Layout
- **Viewport 3D** dominante (à esquerda/centro) + **painel de parâmetros** lateral
  (à direita), em grupos colapsáveis: *Compartilhado*, *Caixa*, *Tampa*, *Barras*,
  *Dobradiça*. Cada parâmetro: rótulo em PT-BR, slider + input numérico sincronizados,
  unidade "mm".
- Barra superior com o título e os botões de **exportar STL** e **exportar STEP**.
- Um controle de **abertura** (slider 0–100% ou botão "Abrir/Fechar") que anima a tampa
  pelo mecanismo. Um *toggle* para ligar/desligar a auto-rotação.

## Cena 3D — estilo keygen.co
- Referência de estética: **keygen.co** — um modelo **sólido**, **flat-shaded**
  (faces chapadas com sombreamento por face: topo mais claro, frente média, laterais
  mais escuras), em **uma única cor** (verde do tema), girando **lentamente na
  horizontal** (turntable em torno do eixo vertical Y — NUNCA tombando na vertical).
  Sombra de contato suave no chão. Nada de wireframe.
- Ao abrir, já renderiza a **caixa padrão** (defaults abaixo) girando assim. Órbita por
  mouse (OrbitControls); ao interagir, pausa a auto-rotação e retoma após alguns segundos.
- Material: `meshStandardMaterial`/`flatShading` em tons de **verde** (`#5EBE83` base),
  com faces ligeiramente distintas para dar o look facetado do keygen. Furos e encaixes
  em verde mais escuro. Iluminação simples (ambient + 1 key light) — visual limpo, sólido,
  não realista demais.
- Renderize: a **caixa** (bloco oco com paredes e fundo), a **tampa** (bandeja invertida
  com topo e saia), e o **mecanismo de 4 barras em cada lado** — 2 barras por lado
  ligando pinos na parede interna da caixa a furos na tampa (veja as imagens: fechada =
  barras recolhidas; aberta = tampa girada para trás/cima, barras estendidas).
- A animação de abertura deve **mover a tampa pela curva do mecanismo** (não uma simples
  rotação de eixo único): a tampa sobe e recua. Se a configuração atual causar
  interferência, mostre um aviso visual sutil (ex.: contorno âmbar) — a lógica de
  viabilidade vem da função `solveHinge` abaixo.

## Parâmetros e valores padrão (unidade: mm)
Compartilhado entre caixa e tampa (o primeiro editado trava o outro — binding bidirecional):
- `width` (largura) = **62**
- `length` (comprimento) = **30**
- `panelThickness` (espessura do fundo da caixa = topo da tampa) = **2**

Caixa:
- `height` (altura) = **22**
- `wallThickness` (espessura das paredes) = **2**
- `holeDiameter` (Ø dos furos) = **2**

Tampa:
- `height` (profundidade da saia) = **6**
- `wallThickness` (espessura das paredes) = **2**

Barras:
- `thickness` (espessura) = **3.5**
- `pegDiameter` (Ø do encaixo no furo) = **1.9** — **deve ser ≤ `holeDiameter`**;
  mantenha travado em `holeDiameter − 0.1` por padrão.

Dobradiça:
- `openGap` (folga entre tampa e caixa quando aberta) = **2**, **ajustável**.
- `openAngle` (ângulo de abertura) = **110**.

Regras de UI: largura/comprimento/espessura do painel são campos **únicos** lidos por
caixa e tampa; `pegDiameter` nunca excede `holeDiameter`; mostre validação inline
quando um valor for fisicamente impossível.

## Pontos de integração (MUITO IMPORTANTE — deixe explícito e isolado)
Implemente estas funções **puras e bem separadas**, para serem substituídas depois por
um backend autoritativo. Não as misture com a UI:

```ts
// Tipos espelham docs/parameter-contract.md
type Params = { units:'mm';
  shared:{ width:number; length:number; panelThickness:number };
  box:{ height:number; wallThickness:number; holeDiameter:number };
  lid:{ height:number; wallThickness:number };
  bars:{ thickness:number; pegDiameter:number };
  hinge:{ openGap:number; openAngle:number };
};

// Resolve a geometria do mecanismo (pivôs + comprimentos das barras) no plano Y-Z.
// Pode usar uma síntese de dois pontos aproximada por enquanto; será trocada por /solve.
function solveHinge(p: Params): {
  feasible: boolean;
  boxPivots: {y:number;z:number}[];   // pinos fixos na caixa (2)
  lidPivots: {y:number;z:number}[];   // furos na tampa (2)
  barLengths: number[];
  openAngle: number;
  clearance: number;
};

// Geometria da caixa/tampa/barras para um dado ângulo de abertura t∈[0,1].
function buildScene(p: Params, openT: number): /* grupos/meshes Three.js */;

// Exportações: STL pode ser feito localmente com STLExporter do three.js.
// STEP deixe como gancho async (vai chamar o backend depois) — pode desabilitar com
// tooltip "exportação STEP via backend" se não for trivial no artifact.
async function exportSTL(p: Params): Promise<Blob>;
async function exportSTEP(p: Params): Promise<Blob>; // placeholder/gancho
```

A `solveHinge` deve, no mínimo: posicionar 2 pivôs na caixa e 2 na tampa de modo que,
ao animar de fechada→aberta, a tampa **gire ~`openAngle`° recuando** e termine a
`openGap` mm da caixa, sem cruzar a parede traseira. Tudo no plano Y-Z, espelhado nos
dois lados.

## Entregáveis e qualidade
- App funcional: ao carregar, caixa padrão já girando; mexer nos sliders atualiza o 3D
  em tempo real; botão de abrir anima o mecanismo; exportar STL baixa um arquivo válido.
- Código organizado em componentes (`Viewport`, `ControlsPanel`, `ParamGroup`,
  `solveHinge`, `buildScene`, `exporters`). Comentários em PT-BR.
- Performático e responsivo. Capriche no acabamento visual — este é o diferencial.
