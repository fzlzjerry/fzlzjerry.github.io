// Press finale: "the catalogue goes to press" (homepage movement 06).
// The cover photograph, sampled into its halftone dots (the same ochre+ink
// screen law as the hero's developing plate), hangs loose in 3D space over the
// closing plate and settles into register as the finale scrolls in. The pointer
// stirs the loose ink with the hero's decaying ring-buffer wake.
//
// This module is a lazy chunk: Layout.astro dynamic-imports it only on desktop
// fine-pointer motion-welcome visits when the finale approaches, so three.js
// never touches the main bundle. createPressFinale returns its dispose handle
// synchronously and does all loading internally, checking `disposed` after
// every await so a page swap mid-load tears down cleanly.
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface PressFinaleOptions {
  src: string;
  ink: number[];
  ochre: number[];
}

const BUDGET = 30000; // dot budget; light cells are skipped, so a fraction survives
const RING = 12; // pointer wake samples (hero halftone uses the same trick)
const FOV = 35;
const CAM_Z = 10;

const VERT = /* glsl */ `
  uniform float uProgress, uTime, uDotScale;
  uniform vec3 uPts[${RING}];
  attribute vec3 aScatter;
  attribute float aSize, aMix, aSeed;
  varying float vMix, vAlpha;
  void main() {
    // per-dot assembly window: seeds stagger the flight so the plate fills
    // grain by grain instead of arriving as one sheet
    float local = clamp((uProgress - aSeed * 0.35) / 0.65, 0.0, 1.0);
    float e = local * local * (3.0 - 2.0 * local);
    vec3 pos = mix(aScatter, position, e);
    // loose ink breathes; settled ink keeps only a faint living grain
    float loose = 1.0 - e * 0.92;
    pos.x += sin(uTime * 0.45 + aSeed * 43.7) * 0.04 * loose;
    pos.y += cos(uTime * 0.38 + aSeed * 71.3) * 0.04 * loose;
    // pointer wake: recent decaying samples push dots aside (stateless inertia)
    for (int i = 0; i < ${RING}; i++) {
      vec2 d2 = pos.xy - uPts[i].xy;
      float d = length(d2) + 1e-4;
      pos.xy += (d2 / d) * uPts[i].z * 0.16 * exp(-d * 5.5);
    }
    vMix = aMix;
    vAlpha = (0.3 + 0.7 * e) * clamp(uProgress * 4.0, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uDotScale / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uInk, uOchre;
  varying float vMix, vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.36, length(c));
    if (a * vAlpha < 0.01) discard;
    gl_FragColor = vec4(mix(uOchre, uInk, vMix), a * vAlpha);
  }
`;

interface Sampled {
  aspect: number;
  rows: number;
  position: Float32Array;
  scatter: Float32Array;
  size: Float32Array;
  mix: Float32Array;
  seed: Float32Array;
}

// Sample the photo at dot-grid resolution. Same screen law as the hero shader:
// light paper cells are skipped, dot area follows darkness, the colour ramps
// ochre -> ink through the midtones.
async function sample(src: string): Promise<Sampled | null> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();
  const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
  const cols = Math.round(Math.min(280, Math.max(160, Math.sqrt(BUDGET * aspect))));
  const rows = Math.max(2, Math.round(cols / aspect));
  const c = document.createElement('canvas');
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, cols, rows);
  const data = ctx.getImageData(0, 0, cols, rows).data;

  const position: number[] = [];
  const scatter: number[] = [];
  const size: number[] = [];
  const mixArr: number[] = [];
  const seed: number[] = [];
  // local units: image height = 1, width = aspect, centred on the origin
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      // Print curve: a blue sky reads as midtone luminance and would dot as
      // evenly as the hazy city below it. Spreading the midtones apart blows
      // the sky out to paper and carves the skyline into real ink, the way a
      // coarse newsprint screen treats a landscape.
      const raw = 1 - lum;
      const ct = Math.min(1, Math.max(0, (raw - 0.18) / 0.72));
      const darkness = ct * ct * (3 - 2 * ct);
      if (darkness < 0.05) continue; // paper shows through
      position.push(
        ((x + 0.5) / cols - 0.5) * aspect,
        0.5 - (y + 0.5) / rows,
        (Math.random() - 0.5) * 0.02,
      );
      scatter.push(
        (Math.random() * 2 - 1) * aspect * 1.05,
        (Math.random() * 2 - 1) * 1.25,
        -1.0 + Math.random() * 1.8,
      );
      size.push(Math.sqrt(darkness));
      const t = Math.min(1, Math.max(0, (darkness - 0.35) / 0.43));
      mixArr.push(t * t * (3 - 2 * t));
      seed.push(Math.random());
    }
  }
  return {
    aspect,
    rows,
    position: new Float32Array(position),
    scatter: new Float32Array(scatter),
    size: new Float32Array(size),
    mix: new Float32Array(mixArr),
    seed: new Float32Array(seed),
  };
}

export function createPressFinale(
  section: HTMLElement,
  opts: PressFinaleOptions,
): { dispose: () => void } | null {
  const canvas = document.createElement('canvas');
  canvas.className = 'press-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  let renderer: WebGLRenderer | null = null;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (e) {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.z = CAM_Z;
  const worldH = 2 * Math.tan((FOV * Math.PI) / 360) * CAM_Z;

  // Volumetric camera parallax: the pointer trucks the camera a little off-axis
  // — POSITION ONLY, never lookAt. Aiming the camera at the plate would project
  // it onto the optical axis (the screen centre), tearing it out of its designed
  // right-of-centre, above-the-email framing and running the ink into the type
  // column. With the axis fixed, near and far dots still shift by different
  // amounts while the cloud is loose (scatter spans roughly z −2..+1.6 world
  // after scaling), which is what reads as volume; the settled plate only sways
  // a few percent and returns to the exact authored framing at rest.
  // Approximation, accepted: the wake's screen->plane mapping below assumes a
  // centred camera, so under full parallax the stirred ink lands a few px off
  // the cursor; the wake is a diffuse field, so it is not worth compensating.
  const camTarget = { x: 0, y: 0 };
  const PARALLAX_X = 0.55; // world units, full amplitude while the ink is loose
  const PARALLAX_Y = 0.4;

  const ringPts: Vector3[] = Array.from({ length: RING }, () => new Vector3(0, 0, 0));
  let ringHead = 0;

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uDotScale: { value: 1 },
    uInk: { value: new Vector3(opts.ink[0], opts.ink[1], opts.ink[2]) },
    uOchre: { value: new Vector3(opts.ochre[0], opts.ochre[1], opts.ochre[2]) },
    uPts: { value: ringPts },
  };

  let disposed = false;
  let geometry: BufferGeometry | null = null;
  let material: ShaderMaterial | null = null;
  let pts: Points | null = null;
  let tween: gsap.core.Tween | null = null;
  let io: IntersectionObserver | null = null;
  let ro: ResizeObserver | null = null;
  let imgAspect = 1.5;
  let rows = 100;
  let ptsScale = 1;
  let worldW = worldH;

  // --- render loop with the loupe's park/wake discipline ---
  const t0 = performance.now();
  let running = false;
  let onScreen = true;
  let lastWake = 0;
  function frame() {
    uniforms.uTime.value = (performance.now() - t0) / 1000;
    let maxS = 0;
    for (const p of ringPts) {
      p.z *= 0.92; // the decay IS the inertia
      if (p.z < 0.001) p.z = 0;
      if (p.z > maxS) maxS = p.z;
    }
    // camera glide toward the pointer's parallax target (per-frame lerp, no
    // tween; pure truck — the axis stays fixed, see the parallax note above).
    // The sway rides the LOOSE ink only: as the plate settles into register the
    // amplitude fades to zero (same law as the cloud's turn below), so the
    // printed sheet keeps its authored framing — and its clearance of the email
    // mark beneath it — no matter where the pointer rests.
    const loose = 1 - uniforms.uProgress.value;
    const ex = camTarget.x * loose;
    const ey = camTarget.y * loose;
    camera.position.x += (ex - camera.position.x) * 0.06;
    camera.position.y += (ey - camera.position.y) * 0.06;
    // the loose cloud hangs slightly turned in the room; exactly 0 at register
    if (pts) pts.rotation.y = loose * 0.18;
    renderer!.render(scene, camera);
    // self-park once the scrub is quiet, the wake has died out AND the camera
    // has finished its glide (never park mid-glide)
    if (
      performance.now() - lastWake > 1600 &&
      maxS < 0.01 &&
      Math.abs(camera.position.x - ex) < 0.002 &&
      Math.abs(camera.position.y - ey) < 0.002
    )
      pause();
  }
  function play() {
    if (!running) {
      running = true;
      gsap.ticker.add(frame);
    }
  }
  function pause() {
    if (running) {
      running = false;
      gsap.ticker.remove(frame);
    }
  }
  function wake() {
    lastWake = performance.now();
    if (onScreen) play();
  }

  function layout() {
    const w = section.clientWidth;
    const h = section.clientHeight;
    if (!w || !h || !pts) return;
    renderer!.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer!.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    worldW = worldH * camera.aspect;
    // The assembled plate hangs right-of-centre (~56%-96% of the section) and
    // rides high enough that its bottom edge clears the oversized email mark,
    // which reaches well right of the text column on narrower desktops.
    const rectW = 0.4 * worldW;
    ptsScale = Math.min(rectW / imgAspect, 0.46 * worldH);
    pts.scale.setScalar(ptsScale);
    pts.position.x = 0.26 * worldW;
    pts.position.y = 0.1 * worldH;
    // dot diameter ~1.35x its grid cell at full darkness (slight overlap reads
    // as solid ink); converted to device px for gl_PointSize
    uniforms.uDotScale.value =
      ptsScale * (1.35 / rows) * renderer!.domElement.height * (CAM_Z / worldH);
  }

  // --- pointer wake (local plane coords, written into the ring buffer) ---
  let lastX = 0;
  let lastY = 0;
  let hasLast = false;
  function onPointerMove(e: PointerEvent) {
    if (!pts) return;
    const r = section.getBoundingClientRect();
    const nx = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
    const ny = 0.5 - (e.clientY - r.top) / Math.max(1, r.height);
    camTarget.x = nx * 2 * PARALLAX_X;
    camTarget.y = ny * 2 * PARALLAX_Y;
    const wx = nx * worldW;
    const wy = ny * worldH;
    const lx = (wx - pts.position.x) / ptsScale;
    const ly = (wy - pts.position.y) / ptsScale;
    const dx = lx - lastX;
    const dy = ly - lastY;
    if (!hasLast || dx * dx + dy * dy > 0.0009) {
      ringHead = (ringHead + 1) % RING;
      ringPts[ringHead].set(lx, ly, Math.min(1, Math.hypot(dx, dy) * 6 + 0.25));
      lastX = lx;
      lastY = ly;
      hasLast = true;
    }
    wake();
  }
  const onPointerLeave = () => {
    camTarget.x = 0;
    camTarget.y = 0;
    wake(); // the glide back to centre needs the ticker
  };
  const onResize = () => {
    layout();
    wake();
  };

  (async () => {
    const sampled = await sample(opts.src).catch(() => null);
    if (!sampled || disposed) return;
    imgAspect = sampled.aspect;
    rows = sampled.rows;

    geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(sampled.position, 3));
    geometry.setAttribute('aScatter', new BufferAttribute(sampled.scatter, 3));
    geometry.setAttribute('aSize', new BufferAttribute(sampled.size, 1));
    geometry.setAttribute('aMix', new BufferAttribute(sampled.mix, 1));
    geometry.setAttribute('aSeed', new BufferAttribute(sampled.seed, 1));

    material = new ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    pts = new Points(geometry, material);
    pts.frustumCulled = false; // scattered dots roam outside the target bounds
    scene.add(pts);

    section.insertBefore(canvas, section.firstChild);
    layout();

    // scroll-scrubbed assembly; clamp() keeps the range reachable even when
    // the finale (last section) cannot climb far up shorter pages
    tween = gsap.fromTo(uniforms.uProgress, { value: 0 }, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'clamp(top 85%)',
        end: 'clamp(top 25%)',
        scrub: 0.4,
        onUpdate: wake,
      },
    });

    io = new IntersectionObserver(
      (ents) => {
        onScreen = ents.some((en) => en.isIntersecting);
        if (onScreen) wake();
        else pause();
      },
      { rootMargin: '120px' },
    );
    io.observe(section);
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(onResize);
      ro.observe(section);
    }
    window.addEventListener('resize', onResize);
    section.addEventListener('pointermove', onPointerMove, { passive: true });
    section.addEventListener('pointerleave', onPointerLeave, { passive: true });
    wake();
  })();

  function dispose() {
    if (disposed) return;
    disposed = true;
    pause();
    io?.disconnect();
    ro?.disconnect();
    window.removeEventListener('resize', onResize);
    section.removeEventListener('pointermove', onPointerMove);
    section.removeEventListener('pointerleave', onPointerLeave);
    // clearMotion() kills ScrollTriggers globally but never their tweens; kill
    // both here so nothing keeps a handle on the uniforms across page swaps
    tween?.scrollTrigger?.kill();
    tween?.kill();
    tween = null;
    geometry?.dispose();
    material?.dispose();
    renderer!.dispose();
    try {
      renderer!.forceContextLoss();
    } catch (e) {
      /* context may already be lost */
    }
    canvas.remove();
  }

  return { dispose };
}
