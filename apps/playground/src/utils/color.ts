/**
 * Tiny colour helpers for the foundations swatches. RN-friendly, no deps.
 */

export type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  // Drop alpha if present (#RRGGBBAA)
  if (h.length === 8) h = h.slice(0, 6);
  if (h.length === 4) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6) return { r: 0, g: 0, b: 0 };
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Approximate CMYK from RGB. Uncalibrated — fine for spec sheets. */
export function rgbToCmyk({ r, g, b }: RGB): { c: number; m: number; y: number; k: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const k = 1 - Math.max(rN, gN, bN);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rN - k) / (1 - k);
  const m = (1 - gN - k) / (1 - k);
  const y = (1 - bN - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/** Relative luminance per WCAG. */
export function luminance({ r, g, b }: RGB): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Pick text color with enough contrast against a swatch. */
export function readableInkOn(hex: string, dark = "#1d2539", light = "#ffffff"): string {
  const lum = luminance(hexToRgb(hex));
  return lum > 0.5 ? dark : light;
}

/** Mix two RGB colors by t∈[0,1]. */
function mix(a: RGB, b: RGB, t: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function rgbToHexStr({ r, g, b }: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Tinted spec-text colour: mostly-on-swatch, but pushed darker (or lighter)
 * for legibility — matches the noon Pantone-card aesthetic.
 */
export function tintedInkOn(hex: string): string {
  const rgb = hexToRgb(hex);
  const dark = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 < 140;
  // Light swatch → darker ink (mix toward black 70%)
  // Dark swatch  → lighter ink (mix toward off-white 75%)
  if (dark) {
    return rgbToHexStr(mix(rgb, { r: 245, g: 235, b: 200 }, 0.78));
  }
  return rgbToHexStr(mix(rgb, { r: 18, g: 22, b: 36 }, 0.78));
}
