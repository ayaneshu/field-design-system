import { useEffect, useRef } from "react";
import { Platform, View } from "react-native";

import { PARTICLE_IMAGE_DATA_URL } from "../assets/particle-image-data";

type Particle = {
  init_x: number;
  init_y: number;
  dest_x: number;
  dest_y: number;
  start_time: number;
  duration: number;
  /** Pre-formatted `rgb(...)` string — parsed once at create time. */
  rgb: string;
  /** Steady-state alpha (0..1). Multiplied by the per-frame fade-in. */
  baseAlpha: number;
  radius: number;
};

// Doubled from 460 to halve the grid step (the spacing between adjacent
// dots) — twice as many dots per axis without changing the dot radius.
const PARTICLE_DENSITY = 920;
// Dot radius (CSS px before dpr scaling). Halved from the original 1.4 to
// make every dot ~50% smaller while leaving the dot radius decoupled from
// the grid spacing.
const PARTICLE_SIZE = 0.7;
const ALPHA_THRESHOLD = 128;
// Tone curve applied to per-pixel luminance/colour. >1 = punchier midtones,
// pushing brights toward 1.0 and darks toward 0 so the silhouette pops.
const CONTRAST = 2.6;
// Floor for monochrome alpha — keeps the darkest particles barely visible
// instead of vanishing entirely, which would create empty patches.
const MIN_MONO_ALPHA = 0.02;
// Fraction of each particle's life spent fading from 0 → baseAlpha.
const FADE_IN_FRACTION = 0.45;
// Initial scatter radius, expressed as a multiple of the viewport size.
// 1.0 = scatter exactly within the canvas; >1 = particles start beyond the
// edges and fly in from off-screen, giving more dramatic convergence.
const SCATTER_FACTOR = 1.9;
// Curve `(v − 0.5) · contrast + 0.5`, clamped to [0, 1].
function applyContrast(v: number): number {
  const x = (v - 0.5) * CONTRAST + 0.5;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/**
 * Full-bleed canvas that renders the bundled image as a swarm of particles.
 * On every `active === true` transition, particles scatter to random
 * positions across the viewport and ease back into the image over ~1.0–1.3s
 * (cubic ease-out, with a small per-particle stagger for organic motion).
 *
 * Web-only — `<canvas>` doesn't exist on native and the bloom hover
 * interaction this is part of is keyboard/cursor-driven anyway.
 *
 * The PNG is inlined as a base64 data URL (see `particle-image-data.ts`)
 * to avoid platform-specific asset-resolution differences between Metro
 * and RN-Web. The canvas just needs a URL it can fetch.
 */
export function ParticleImageField({
  active,
  tone = "light",
}: {
  active: boolean;
  /**
   * Which monochrome side to render on:
   *  - "light"  → white particles (use on a dark bloom — light-mode page)
   *  - "dark"   → black particles (use on a white bloom — dark-mode page)
   *
   * Per-particle alpha always reads the source pixel's luminance through
   * the contrast curve, then projects it onto the chosen tone so the photo
   * silhouette reads the same in both modes.
   */
  tone?: "light" | "dark";
}) {
  const containerRef = useRef<View>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(active);

  // Keep the latest `active` flag readable from the rAF loop without
  // re-creating the loop on every toggle.
  activeRef.current = active;

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const container = containerRef.current as unknown as HTMLDivElement | null;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sized = { w: 0, h: 0 };
    const resize = () => {
      sized.w = container.clientWidth;
      sized.h = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(sized.w * dpr);
      canvas.height = Math.round(sized.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Build particles from the loaded image, sampling pixels on a stride
    // matched to PARTICLE_DENSITY. Image is sized "contain" so the whole
    // photo stays visible — the larger axis matches the viewport, the
    // smaller axis leaves whitespace that the bloom veil paints over.
    //
    // Particle size and grid spacing scale with `devicePixelRatio`, which
    // tracks browser zoom (and HiDPI displays) — zoom in → fewer, larger
    // dots, so the dot pattern visually scales with the page rather than
    // staying pinned to a fixed CSS-pixel density.
    const buildParticles = (img: HTMLImageElement) => {
      if (!sized.w || !sized.h) return;
      const dpr = window.devicePixelRatio || 1;
      const imgAspect = img.width / img.height;
      const canvasAspect = sized.w / sized.h;
      let drawW: number, drawH: number;
      if (imgAspect > canvasAspect) {
        // Image is wider than the viewport — match viewport WIDTH and
        // letterbox the top so the whole photo stays in frame.
        drawW = sized.w;
        drawH = sized.w / imgAspect;
      } else {
        // Image is taller (or matches) — match viewport HEIGHT and
        // pillarbox the sides.
        drawH = sized.h;
        drawW = sized.h * imgAspect;
      }
      // Centre horizontally; anchor to the BOTTOM of the canvas so the
      // grassland in the lower half of the image sits flush with the
      // bottom of the screen. Whitespace (if any) goes to the top.
      const drawX = (sized.w - drawW) / 2;
      const drawY = sized.h - drawH;

      ctx.clearRect(0, 0, sized.w, sized.h);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const pixelData = ctx.getImageData(0, 0, sized.w, sized.h);
      ctx.clearRect(0, 0, sized.w, sized.h);

      // Grid step scales by dpr so a denser viewport (zoom-in / retina)
      // gets MORE CSS px per dot, not the same.
      const increment = Math.max(
        1,
        Math.round((pixelData.width * dpr) / PARTICLE_DENSITY),
      );
      const particleRadius = PARTICLE_SIZE * dpr;
      const now = performance.now();
      const next: Particle[] = [];
      for (let i = 0; i < pixelData.width; i += increment) {
        for (let j = 0; j < pixelData.height; j += increment) {
          const idx = (i + j * pixelData.width) * 4;
          if (pixelData.data[idx + 3] <= ALPHA_THRESHOLD) continue;
          const r = pixelData.data[idx];
          const g = pixelData.data[idx + 1];
          const b = pixelData.data[idx + 2];
          // Rec. 709 luminance → contrast curve → particle alpha.
          //  - Light tone (white particles): bright source = opaque white,
          //    dark source = faint white — natural reading of the photo.
          //  - Dark tone (black particles): dark source = opaque black,
          //    bright source = faint black — silhouette still reads.
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          const projected = tone === "dark" ? 1 - lum : lum;
          const baseAlpha = Math.max(MIN_MONO_ALPHA, applyContrast(projected));
          const rgb = tone === "dark" ? "rgb(0,0,0)" : "rgb(255,255,255)";
          // Scatter init positions over a region SCATTER_FACTOR× the canvas
          // size, centred on the canvas — particles start well off-screen.
          const sx = sized.w / 2 + (Math.random() - 0.5) * sized.w * SCATTER_FACTOR;
          const sy = sized.h / 2 + (Math.random() - 0.5) * sized.h * SCATTER_FACTOR;
          next.push({
            init_x: sx,
            init_y: sy,
            dest_x: i,
            dest_y: j,
            start_time: now + Math.random() * 180,
            duration: 1000 + Math.random() * 300,
            rgb,
            baseAlpha,
            radius: particleRadius,
          });
        }
      }
      particlesRef.current = next;
    };

    const animate = () => {
      const ps = particlesRef.current;
      ctx.clearRect(0, 0, sized.w, sized.h);
      if (activeRef.current && ps.length) {
        const now = performance.now();
        for (const p of ps) {
          const elapsed = now - p.start_time;
          if (elapsed <= 0) continue; // hasn't started yet (within stagger window)
          const t = Math.min(1, elapsed / p.duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const x = p.init_x + (p.dest_x - p.init_x) * eased;
          const y = p.init_y + (p.dest_y - p.init_y) * eased;
          // Fade-in: alpha ramps 0→baseAlpha over the first FADE_IN_FRACTION
          // of the particle's lifetime so the swarm doesn't pop in fully
          // opaque on frame one.
          const fade = t < FADE_IN_FRACTION ? t / FADE_IN_FRACTION : 1;
          ctx.globalAlpha = fade * p.baseAlpha;
          ctx.fillStyle = p.rgb;
          ctx.beginPath();
          ctx.arc(x, y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      rafRef.current = window.requestAnimationFrame(animate);
    };

    const img = new window.Image();
    imageRef.current = img;
    img.onload = () => {
      resize();
      buildParticles(img);
      if (rafRef.current == null) rafRef.current = window.requestAnimationFrame(animate);
    };
    img.src = PARTICLE_IMAGE_DATA_URL;

    const onResize = () => {
      resize();
      if (imageRef.current?.complete) buildParticles(imageRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      canvas.remove();
      canvasRef.current = null;
      particlesRef.current = [];
      imageRef.current = null;
    };
  }, [tone]);

  // Re-trigger the scatter→converge each time `active` flips true.
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!active) return;
    const ps = particlesRef.current;
    if (!ps.length || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const now = performance.now();
    for (const p of ps) {
      p.init_x = w / 2 + (Math.random() - 0.5) * w * SCATTER_FACTOR;
      p.init_y = h / 2 + (Math.random() - 0.5) * h * SCATTER_FACTOR;
      p.start_time = now + Math.random() * 180;
      p.duration = 1000 + Math.random() * 300;
    }
  }, [active]);

  if (Platform.OS !== "web") return null;
  return (
    <View
      ref={containerRef}
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}
