/* @ds-bundle: {"namespace":"BlueprintDS","components":[{"name":"Badge","sourcePath":"components/general/Badge/Badge.jsx"},{"name":"Button","sourcePath":"components/general/Button/Button.jsx"},{"name":"Dimension","sourcePath":"components/general/Dimension/Dimension.jsx"},{"name":"NumberField","sourcePath":"components/general/NumberField/NumberField.jsx"},{"name":"Panel","sourcePath":"components/general/Panel/Panel.jsx"},{"name":"TitleBlock","sourcePath":"components/general/TitleBlock/TitleBlock.jsx"}],"sourceHashes":{"components/general/Badge/Badge.jsx":"e9c5ca6720d8","components/general/Badge/Badge.d.ts":"935926a1e469","components/general/Badge/Badge.prompt.md":"24ce07ee1048","components/general/Button/Button.jsx":"91fea28a76c3","components/general/Button/Button.d.ts":"3d67f7d34d96","components/general/Button/Button.prompt.md":"00bc25241543","components/general/Dimension/Dimension.jsx":"7312e2080488","components/general/Dimension/Dimension.d.ts":"799f6a1f0f52","components/general/Dimension/Dimension.prompt.md":"e0db4f9d64ec","components/general/NumberField/NumberField.jsx":"ba42e11a93b9","components/general/NumberField/NumberField.d.ts":"9e7f537f5c6b","components/general/NumberField/NumberField.prompt.md":"d1b8bcc17c7d","components/general/Panel/Panel.jsx":"401eebd5e01e","components/general/Panel/Panel.d.ts":"d8b14df2fe0b","components/general/Panel/Panel.prompt.md":"dd0ee67345e2","components/general/TitleBlock/TitleBlock.jsx":"f423384b7ff9","components/general/TitleBlock/TitleBlock.d.ts":"d1d0439bdc59","components/general/TitleBlock/TitleBlock.prompt.md":"4a2e1bc55962"},"inlinedExternals":[],"builtBy":"cc-design-sync"} */
"use strict";
var BlueprintDS = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <define:import.meta.env>
  var init_define_import_meta_env = __esm({
    "<define:import.meta.env>"() {
    }
  });

  // shim:react-shim
  var require_react_shim = __commonJS({
    "shim:react-shim"(exports, module) {
      init_define_import_meta_env();
      var R = window.React;
      function np(p, k) {
        var o = {};
        for (var x in p) if (x !== "children") o[x] = p[x];
        if (k !== void 0) o.key = k;
        return o;
      }
      function jsx7(t, p, k) {
        var c = p && p.children;
        return c === void 0 ? R.createElement(t, np(p, k)) : R.createElement(t, np(p, k), c);
      }
      function jsxs5(t, p, k) {
        return R.createElement.apply(R, [t, np(p, k)].concat(p.children));
      }
      module.exports = R;
      module.exports.jsx = jsx7;
      module.exports.jsxs = jsxs5;
      module.exports.jsxDEV = function(t, p, k, s) {
        return (s ? jsxs5 : jsx7)(t, p, k);
      };
      module.exports.Fragment = R.Fragment;
    }
  });

  // dist/index.js
  var index_exports = {};
  __export(index_exports, {
    Badge: () => Badge,
    Button: () => Button,
    Dimension: () => Dimension,
    NumberField: () => NumberField,
    Panel: () => Panel,
    TitleBlock: () => TitleBlock,
    tokens: () => tokens
  });
  init_define_import_meta_env();
  var import_jsx_runtime = __toESM(require_react_shim(), 1);
  var import_jsx_runtime2 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime3 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime4 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime5 = __toESM(require_react_shim(), 1);
  var import_jsx_runtime6 = __toESM(require_react_shim(), 1);
  var tokens = {
    color: {
      green: "#5EBE83",
      // acento primário — só ação/estado/destaque
      greenBright: "#84DBA6",
      // brilho, valores, hover, foco
      greenDim: "#3E8E5E",
      // bordas verdes discretas
      greenDeep: "#1C3A2A",
      // preenchimento de hover (outline)
      paper: "#0F1518",
      // fundo (grafite com viés azul de prancheta)
      sheet: "#121A1E",
      // superfície de seções
      panel: "#16201F",
      // painéis/cards
      line: "#243036",
      // bordas e grade
      line2: "#2E3C40",
      // bordas de inputs/molduras
      ink: "#DCE8E4",
      // texto principal
      muted: "#7E8C88",
      // texto secundário
      faint: "#54605C",
      // rótulos discretos/metadados
      dim: "#79B9A4"
      // linhas de cota
    },
    font: {
      // títulos / rótulos / botões — lettering técnico (ISOCPEUR embarcada)
      display: '"ISOCPEUR",system-ui,sans-serif',
      // texto corrido — fontes de sistema
      sans: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',
      // números, valores e cotas (sempre com unidade) — mono de sistema
      mono: 'ui-monospace,"SF Mono",Menlo,Consolas,monospace'
    },
    size: { display: 40, h2: 24, h3: 18, body: 15, mono: 14, label: 11 },
    radius: 0,
    // cantos retos em tudo
    space: [0, 4, 8, 12, 16, 24, 32, 48],
    // base 4px
    borderWidth: 1
  };
  function Button({ variant = "secondary", className = "", ...rest }) {
    const cls = ["ds-btn", variant === "primary" ? "ds-btn--primary" : "", className].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: cls, ...rest });
  }
  function NumberField({ label, value, unit = "mm", min = 0, max = 100, onChange }) {
    const pct = max > min ? Math.min(100, Math.max(0, (value - min) / (max - min) * 100)) : 0;
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ds-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("label", { className: "ds-field__label", children: [
        label,
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("b", { children: [
          value,
          " ",
          unit
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ds-field__inp", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "input",
          {
            type: "number",
            value,
            min,
            max,
            "aria-label": label,
            onChange: (e) => onChange?.(Number(e.target.value))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ds-field__unit", children: unit })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "ds-field__track", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ds-field__fill", style: { width: `${pct}%` } }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "ds-field__thumb", style: { left: `${pct}%` } })
      ] })
    ] });
  }
  function Panel({ title, tag, children }) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { className: "ds-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("header", { className: "ds-panel__head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "ds-panel__title", children: title }),
        tag ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "ds-panel__tag", children: tag }) : null
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "ds-panel__body", children })
    ] });
  }
  function Badge({ children, variant = "outline" }) {
    const cls = [
      "ds-badge",
      variant === "solid" ? "ds-badge--solid" : "",
      variant === "dashed" ? "ds-badge--dashed" : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: cls, children });
  }
  function Dimension({ label }) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ds-dim", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ds-dim__label", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "ds-dim__line", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ds-dim__tick" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ds-dim__rule" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ds-dim__tick" })
      ] })
    ] });
  }
  function TitleBlock({ eyebrow, children, cells = [] }) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "ds-titleblock", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ds-titleblock__main", children: [
        eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ds-titleblock__eyebrow", children: eyebrow }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "ds-titleblock__title", children })
      ] }),
      cells.map((c) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ds-titleblock__cell", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ds-titleblock__k", children: c.k }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ds-titleblock__v", children: c.v })
      ] }, c.k))
    ] });
  }
  return __toCommonJS(index_exports);
})();
window.BlueprintDS=BlueprintDS.__dsMainNs?Object.assign({},BlueprintDS,BlueprintDS.__dsMainNs,{__dsMainNs:undefined}):BlueprintDS;
