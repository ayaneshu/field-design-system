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
  font-display: swap;
}`;
  }).join("\n\n");
}
