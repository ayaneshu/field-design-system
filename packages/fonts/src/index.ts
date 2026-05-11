/**
 * Noontree font assets + loaders.
 *
 * The font files live next to this module under ./files. Tokens emitted by
 * @field-ds/tokens reference fonts as `Noontree-{Weight}` (e.g. "Noontree-Bold"),
 * so consumers must register the family under those exact names.
 */

export const NOONTREE_WEIGHTS = [
  "Light",
  "Regular",
  "Medium",
  "SemiBold",
  "Bold",
  "ExtraBold",
  "Black",
] as const;

export type NoontreeWeight = (typeof NOONTREE_WEIGHTS)[number];

/**
 * CSS numeric weight per face. The `@font-face` declarations emitted by
 * {@link noontreeWebFontFace} must include these as `font-weight:` descriptors,
 * otherwise the browser registers each face at the default weight (400) and
 * synthesises a faux-bold transformation when consumers set `font-weight: 600`
 * (or any value > 400). Faux-bold over an already-weighted face is the
 * production "everything looks Bold" bug.
 */
export const NOONTREE_WEIGHT_NUMERIC: Record<NoontreeWeight, number> = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900,
};

/**
 * Map of font family name → require()-able OTF asset.
 *
 * Drop this directly into Expo's `useFonts` hook:
 *
 * ```ts
 * import { noontreeFonts } from "@field-ds/fonts";
 * const [loaded] = useFonts(noontreeFonts);
 * ```
 *
 * Each key matches the `fontFamily` value emitted by @field-ds/tokens text styles.
 */
export const noontreeFonts = {
  "Noontree-Light": require("./files/Noontree-Light.otf"),
  "Noontree-Regular": require("./files/Noontree-Regular.otf"),
  "Noontree-Medium": require("./files/Noontree-Medium.otf"),
  "Noontree-SemiBold": require("./files/Noontree-SemiBold.otf"),
  "Noontree-Bold": require("./files/Noontree-Bold.otf"),
  "Noontree-ExtraBold": require("./files/Noontree-ExtraBold.otf"),
  "Noontree-Black": require("./files/Noontree-Black.otf"),
};

/**
 * @font-face declarations for the web. Use as a stylesheet string or split per
 * face. WOFF2 is preferred and falls back to WOFF.
 *
 * Each face carries its numeric `font-weight` descriptor (per
 * {@link NOONTREE_WEIGHT_NUMERIC}) so consumers can apply `font-weight: 600`
 * etc. without the browser synthesising faux-bold on top of an already-
 * weighted face.
 *
 * ```ts
 * import { noontreeWebFontFace } from "@field-ds/fonts";
 * const styleEl = document.createElement("style");
 * styleEl.textContent = noontreeWebFontFace("/fonts");
 * document.head.appendChild(styleEl);
 * ```
 *
 * @param baseUrl Public URL where the font files are served (no trailing slash).
 */
export function noontreeWebFontFace(baseUrl: string): string {
  return NOONTREE_WEIGHTS.map((w) => {
    return `@font-face {
  font-family: "Noontree-${w}";
  src: url("${baseUrl}/Noontree-${w}.woff2") format("woff2"),
       url("${baseUrl}/Noontree-${w}.woff") format("woff");
  font-weight: ${NOONTREE_WEIGHT_NUMERIC[w]};
  font-style: normal;
  font-display: swap;
}`;
  }).join("\n\n");
}

/**
 * Inject `@font-face` declarations on the web. No-op on native (where the
 * Expo `useFonts` hook handles loading via the {@link noontreeFonts} map).
 *
 * Why this exists: expo-font's web font loader registers each face WITHOUT a
 * `font-weight` descriptor, so the browser treats the family as weight 400 and
 * synthesises faux-bold whenever a text style sets `font-weight: 600` (or
 * higher). Calling this once at app boot adds a parallel set of @font-face
 * entries that DO carry numeric weight metadata, which the browser prefers
 * over expo-font's weightless ones — eliminating faux-bold across the app.
 *
 * Idempotent — repeated calls reuse the same `<style>` element.
 *
 * @param baseUrl Public URL where the font files are served (no trailing
 *   slash). Defaults to `/fonts`.
 */
export function registerNoontreeWebFonts(baseUrl: string = "/fonts"): void {
  if (typeof document === "undefined") return;
  const STYLE_ID = "field-ds-noontree-fontface";
  if (document.getElementById(STYLE_ID)) return;
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ID;
  styleEl.textContent = noontreeWebFontFace(baseUrl);
  document.head.appendChild(styleEl);
}
