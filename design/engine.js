// ============================================================================
//  engine.js — Núcleo 3D do Box Hinge Calculator (Three.js puro, ESM)
//  A SOLUÇÃO do mecanismo (síntese de Burmester) é AUTORITATIVA no backend:
//    - solveRemote(params)  -> POST /solve   (pivôs, barras, ângulos da manivela)
//    - exportFile(params,f) -> POST /export/{fmt}  (STEP/STL exatos do CadQuery)
//  O engine só faz o REPLAY barato do mecanismo (interseção círculo-círculo) para
//  animar a tampa e desenha a geometria do preview. Plano 2D = (u, v) = (Y, Z).
//  Mapeamento Three: X=largura, Y(up)=altura(v), Z=profundidade(u).
// ============================================================================

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const BACKEND = (typeof window !== "undefined" && window.BHC_BACKEND) || "http://localhost:8000";

const COL_BASE = 0x5ebe83;
const COL_BAR  = 0x3e8e5e;
const COL_HOLE = 0x10201a;
const COL_WARN = 0xe0a04a;

// ----------------------------- API backend ---------------------------------
export async function solveRemote(params) {
  const res = await fetch(`${BACKEND}/solve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`/solve ${res.status}`);
  return res.json();
}

export async function exportFile(params, fmt) {
  const res = await fetch(`${BACKEND}/export/${fmt}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`/export/${fmt} ${res.status}`);
  return res.blob();
}

// ------------------------- replay do mecanismo (2D) -------------------------
const smooth = (t) => t * t * (3 - 2 * t);

function circleIntersect(c0, r0, c1, r1, branch) {
  const dx = c1[0] - c0[0], dy = c1[1] - c0[1];
  const D = Math.hypot(dx, dy);
  if (D < 1e-9 || D > r0 + r1 || D < Math.abs(r0 - r1)) return null;
  const a = (r0 * r0 - r1 * r1 + D * D) / (2 * D);
  const h2 = r0 * r0 - a * a;
  const h = h2 > 0 ? Math.sqrt(h2) : 0;
  const bx = c0[0] + (a * dx) / D, by = c0[1] + (a * dy) / D;
  return [bx + branch * (-h * dy) / D, by + branch * (h * dx) / D];
}

// converte Point2D {y:v, z:u} -> [u, v]
const uv = (p) => [p.z, p.y];

// Pose da tampa para t∈[0,1]: replay da manivela G1->m1 + acoplador -> m2.
function poseAt(sol, t) {
  const G1 = uv(sol.boxPivots[0]), G2 = uv(sol.boxPivots[1]);
  const m1c = uv(sol.lidPivots[0]), m2c = uv(sol.lidPivots[1]);
  const [r1, r2] = sol.barLengths;
  const c = sol.couplerLength;
  const a = sol.crankClosed + (sol.crankOpen - sol.crankClosed) * smooth(Math.max(0, Math.min(1, t)));
  const m1 = [G1[0] + r1 * Math.cos(a), G1[1] + r1 * Math.sin(a)];
  const m2 = circleIntersect(G2, r2, m1, c, sol.branch) || m2c;
  const phi = Math.atan2(m2[1] - m1[1], m2[0] - m1[0]) - Math.atan2(m2c[1] - m1c[1], m2c[0] - m1c[0]);
  return { G1, G2, m1c, m2c, m1, m2, phi, r1, r2 };
}

// ----------------------------- materiais ------------------------------------
function mat(color, warn = false) {
  return new THREE.MeshStandardMaterial({
    color: warn ? COL_WARN : color, flatShading: true, roughness: 0.62, metalness: 0.0,
  });
}
function boxMesh(cx, cy, cz, sx, sy, sz, m) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m);
  mesh.position.set(cx, cy, cz);
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}
// cilindro com eixo ao longo de X
function xCyl(radius, length, m) {
  const g = new THREE.CylinderGeometry(radius, radius, length, 20);
  g.rotateZ(Math.PI / 2);
  return new THREE.Mesh(g, m);
}

// ----------------------------- buildScene -----------------------------------
// Constrói caixa (oca) + tampa empilhada (grupo animável) + barras (em update()).
// `sol` pode ser null (sem solução ainda) -> desenha só caixa+tampa.
export function buildScene(p, sol, openT) {
  const W = p.shared.width, L = p.shared.length, H = p.box.height;
  const wt = p.shared.wallThickness, pt = p.shared.panelThickness, hd = p.shared.holeDiameter;
  const lh = p.lid.height, bt = wt, bw = p.bars.width, pd = p.bars.pegDiameter;
  const feasible = !!(sol && sol.feasible);
  const baseMat = mat(COL_BASE), holeMat = mat(COL_HOLE), barMat = mat(COL_BAR, !feasible);

  const group = new THREE.Group();

  // -------- CAIXA (fundo + 4 paredes), Y(altura)=0..H --------
  const boxG = new THREE.Group();
  boxG.add(boxMesh(0, pt / 2, L / 2, W, pt, L, baseMat));                              // fundo
  boxG.add(boxMesh(0, H / 2, L - wt / 2, W, H, wt, baseMat));                          // parede fundo
  boxG.add(boxMesh(0, H / 2, wt / 2, W, H, wt, baseMat));                              // parede frente
  boxG.add(boxMesh(W / 2 - wt / 2, H / 2, L / 2, wt, H, L - 2 * wt, baseMat));         // lateral +X
  boxG.add(boxMesh(-(W / 2 - wt / 2), H / 2, L / 2, wt, H, L - 2 * wt, baseMat));      // lateral -X
  // furos passantes (marcadores escuros) — só na parede de CADA lado (não atravessa)
  if (sol) for (const piv of sol.boxPivots) for (const sx of [-1, 1]) {
    const m = xCyl(hd / 2 + 0.05, wt + 0.4, holeMat);
    m.position.set(sx * (W / 2 - wt / 2), piv.y, piv.z);
    boxG.add(m);
  }
  group.add(boxG);

  // -------- TAMPA empilhada (Y=H..H+lh), grupo animável em torno de m1c --------
  const lidGroup = new THREE.Group();
  const lidInner = new THREE.Group();
  lidGroup.add(lidInner);
  // topo (em cima) + 4 paredes descendo até Y=H
  lidInner.add(boxMesh(0, H + lh - pt / 2, L / 2, W, pt, L, baseMat));                 // topo
  const skY = H + (lh - pt) / 2;
  lidInner.add(boxMesh(0, skY, L - wt / 2, W, lh - pt, wt, baseMat));                  // fundo
  lidInner.add(boxMesh(0, skY, wt / 2, W, lh - pt, wt, baseMat));                      // frente
  lidInner.add(boxMesh(W / 2 - wt / 2, skY, L / 2, wt, lh - pt, L - 2 * wt, baseMat)); // +X
  lidInner.add(boxMesh(-(W / 2 - wt / 2), skY, L / 2, wt, lh - pt, L - 2 * wt, baseMat));// -X
  if (sol) for (const piv of sol.lidPivots) for (const sx of [-1, 1]) {
    const m = xCyl(hd / 2 + 0.05, wt + 0.4, holeMat);
    m.position.set(sx * (W / 2 - wt / 2), piv.y, piv.z);
    lidInner.add(m);
  }
  group.add(lidGroup);

  // -------- BARRAS (reconstruídas em update) --------
  let bars = [];
  function makeBar(G, m, side) {
    const grp = new THREE.Group();
    const x_in = side * (W / 2 + 0.2);          // barras COPLANARES (sem camadas em X)
    const xc = x_in + side * (bt / 2);
    const Gv = G[1], Gu = G[0], Mv = m[1], Mu = m[0];
    const len = Math.hypot(Mu - Gu, Mv - Gv);
    const body = boxMesh(xc, (Gv + Mv) / 2, (Gu + Mu) / 2, bt, len, bw, barMat);
    body.rotation.x = Math.atan2(Mu - Gu, Mv - Gv);
    grp.add(body);
    for (const [pv, pu] of [[Gv, Gu], [Mv, Mu]]) {
      const cap = xCyl(bw / 2, bt, barMat); cap.position.set(xc, pv, pu); grp.add(cap);
      const lpeg = wt + 1.2;                     // pino: parede + 1.2 mm
      const peg = xCyl(pd / 2, lpeg, mat(COL_BASE)); peg.position.set(x_in - side * (lpeg / 2), pv, pu); grp.add(peg);
    }
    return grp;
  }

  function update(t) {
    // tampa
    if (sol && feasible) {
      const ps = poseAt(sol, t);
      lidInner.position.set(0, -ps.m1c[1], -ps.m1c[0]);
      lidGroup.position.set(0, ps.m1[1], ps.m1[0]);
      lidGroup.rotation.x = -ps.phi;
      for (const b of bars) group.remove(b);
      bars = [];
      const pairs = [[ps.G1, ps.m1], [ps.G2, ps.m2]];
      for (const side of [-1, 1]) for (const [G, m] of pairs) {
        const bar = makeBar(G, m, side); group.add(bar); bars.push(bar);
      }
    } else {
      lidInner.position.set(0, 0, 0);
      lidGroup.position.set(0, 0, 0);
      lidGroup.rotation.x = 0;
    }
  }

  update(openT);
  return { group, update };
}

// ============================================================================
//  SceneManager — cena, luzes, sombra, turntable e órbita (API imperativa).
// ============================================================================
class SceneManager {
  constructor(container) {
    this.container = container;
    this.params = null; this.sol = null; this.openT = 0; this.autoRotate = true;
    this.scene = new THREE.Scene();
    const w = container.clientWidth || 800, h = container.clientHeight || 600;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = "block";

    this.camera = new THREE.PerspectiveCamera(34, w / h, 0.5, 4000);
    this.camera.position.set(118, 100, 150);

    this.scene.add(new THREE.AmbientLight(0x5a6e68, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(80, 150, 90); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const s = 160;
    key.shadow.camera.left = -s; key.shadow.camera.right = s;
    key.shadow.camera.top = s; key.shadow.camera.bottom = -s;
    key.shadow.camera.near = 10; key.shadow.camera.far = 700; key.shadow.bias = -0.0006;
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x88c0aa, 0.35);
    fill.position.set(-90, 50, -50); this.scene.add(fill);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.ShadowMaterial({ opacity: 0.32 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; this.scene.add(ground);

    this.turntable = new THREE.Group(); this.scene.add(this.turntable);
    this.model = null; this.updateFn = null;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 50; this.controls.maxDistance = 700;
    this.controls.maxPolarAngle = Math.PI * 0.95;
    this.controls.target.set(0, 16, 16);
    this._resumeTimer = null;
    this.controls.addEventListener("start", () => { this.autoRotate = false; if (this._resumeTimer) clearTimeout(this._resumeTimer); });
    this.controls.addEventListener("end", () => {
      if (this._resumeTimer) clearTimeout(this._resumeTimer);
      this._resumeTimer = setTimeout(() => { if (this._userAuto !== false) this.autoRotate = true; }, 3500);
    });
    this._onResize = () => this.resize(); window.addEventListener("resize", this._onResize);
    this._running = true; this._lastT = performance.now(); this._loop();
    window.__SM = this;
  }

  // Rebuild da geometria. Recebe params + solução (do backend; pode ser null).
  setModel(params, sol) {
    this.params = params; this.sol = sol;
    if (this.model) { this.turntable.remove(this.model); this.model.traverse((o) => o.geometry && o.geometry.dispose()); }
    const built = buildScene(params, sol, this.openT);
    this.model = built.group; this.updateFn = built.update;
    // centraliza no pivô: caixa centrada em X; mira no meio (altura, profundidade)
    this.model.position.set(0, 0, -params.shared.length / 2);
    this.turntable.add(this.model);
    this.controls.target.set(0, (params.box.height + params.lid.height) * 0.5, 0);
  }
  setOpen(t) { this.openT = t; if (this.updateFn) this.updateFn(t); }
  setAutoRotate(on) { this._userAuto = on; this.autoRotate = on; }
  resetView() {
    this.camera.position.set(118, 100, 150);
    this.controls.target.set(0, ((this.params?.box.height || 22) + (this.params?.lid.height || 8)) * 0.5, 0);
    this.controls.update();
  }
  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h);
  }
  _loop() {
    if (!this._running) return;
    const now = performance.now(), dt = (now - this._lastT) / 1000; this._lastT = now;
    if (this.autoRotate && this.turntable) this.turntable.rotation.y += dt * 0.32;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this._loop());
  }
  dispose() {
    this._running = false; window.removeEventListener("resize", this._onResize);
    this.controls.dispose(); this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}

window.HingeEngine = { createScene: (c) => new SceneManager(c), solveRemote, exportFile, buildScene, THREE };
window.__engineReady = true;
if (typeof window.__onEngineReady === "function") window.__onEngineReady();
