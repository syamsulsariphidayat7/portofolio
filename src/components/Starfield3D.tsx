"use client";

import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending,
  NormalBlending,
  IcosahedronGeometry,
  WireframeGeometry,
  LineSegments,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  TorusGeometry,
  Group,
  Clock,
  type Material,
} from "three";

const PARTICLE_COUNT = 240; /* sedikit saja biar simple — dulu 700, terasa terlalu rame di hero */
const MAX_DPR = 1.75;

/**
 * Starfield3D — latar WebGL 3D: kumpulan partikel bintang dengan kedalaman
 * nyata + core wireframe icosahedron yang berputar. Reaktif terhadap mouse
 * (parallax kamera), mengikuti tema dark/light, berhenti saat di luar layar,
 * dan dirender statis untuk prefers-reduced-motion.
 */
export function Starfield3D({
  className = "",
  corePosition = [4.6, 0.7, -3],
}: {
  className?: string;
  /** Posisi core wireframe di world-space. Hero: kanan; stats: tengah. */
  corePosition?: readonly [number, number, number];
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [coreX, coreY, coreZ] = corePosition;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Renderer ---------- */
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      140
    );
    camera.position.set(0, 0, 30);

    /* ---------- Partikel bintang 3D ---------- */
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const teal = new Color("#2dd4bf");
    const indigo = new Color("#818cf8");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      /* Distribusi padat di tengah, menyebar ke luar */
      const r = 7 + Math.pow(Math.random(), 0.55) * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      /* Pipihkan vertikal + kedalaman agar "galaksi" terasa */
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.72;

      const c = Math.random() < 0.62 ? teal : indigo;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const pGeo = new BufferGeometry();
    pGeo.setAttribute("position", new BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new BufferAttribute(colors, 3));

    const pMat = new PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new Points(pGeo, pMat);
    scene.add(points);

    /* ---------- Core wireframe icosahedron ---------- */
    const icoGeo = new IcosahedronGeometry(3.4, 1);
    const wire = new LineSegments(
      new WireframeGeometry(icoGeo),
      new LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.42 })
    );
    const shell = new Mesh(
      icoGeo,
      new MeshBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      })
    );
    const core = new Group();
    core.add(wire, shell);
    core.position.set(coreX, coreY, coreZ);

    const ringGeo = new TorusGeometry(4.9, 0.014, 8, 140);
    const ring = new Mesh(
      ringGeo,
      new MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.24 })
    );
    ring.position.copy(core.position);
    ring.rotation.x = Math.PI / 2.5;

    scene.add(core, ring);

    /* ---------- Parallax mouse ---------- */
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    /* ---------- Tema dark/light ---------- */
    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      pMat.blending = dark ? AdditiveBlending : NormalBlending;
      pMat.opacity = dark ? 0.75 : 0.38;
      (wire.material as Material).opacity = dark ? 0.42 : 0.22;
      (shell.material as Material).opacity = dark ? 0.06 : 0.03;
      (ring.material as Material).opacity = dark ? 0.24 : 0.12;
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /* ---------- Loop animasi ---------- */
    const clock = new Clock();
    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      const t = clock.getElapsedTime();

      points.rotation.y = t * 0.02;
      points.rotation.x = Math.sin(t * 0.05) * 0.06;
      core.rotation.y = t * 0.14;
      core.rotation.x = Math.sin(t * 0.11) * 0.09;
      ring.rotation.z = t * 0.05;

      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      camera.position.x = px * 4.2;
      camera.position.y = -py * 2.8;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (reduce) return;
      raf = requestAnimationFrame(tick);
    };

    if (reduce) {
      tick(); /* satu frame statis */
    } else {
      raf = requestAnimationFrame(tick);
    }

    /* ---------- Jeda saat di luar layar / tab disembunyikan ---------- */
    const resume = () => {
      if (reduce || running) return;
      running = true;
      clock.getDelta(); /* reset delta biar tidak melompat */
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting) resume();
      else pause();
    });
    io.observe(mount);
    const onVis = () => {
      if (document.hidden) pause();
      else resume();
    };
    document.addEventListener("visibilitychange", onVis);

    /* ---------- Resize ---------- */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      pGeo.dispose();
      pMat.dispose();
      /* shell.geometry === icoGeo, sudah di-dispose di bawah */
      wire.geometry.dispose();
      (wire.material as Material).dispose();
      shell.geometry.dispose();
      (shell.material as Material).dispose();
      ringGeo.dispose();
      (ring.material as Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [coreX, coreY, coreZ]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
