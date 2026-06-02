/**
 * Generates TypeScript modules from DTCG-style JSON token sources.
 *
 * Inputs : src/raw/{base,semantic,text-styles}.json
 * Outputs: src/{base,semantic,text-styles,index}.ts
 *
 * Resolution rules:
 *  - Strings of the form "{a.b.c}" are alias references and are resolved
 *    against the merged tree of base + semantic + text-styles.
 *  - Dimension values like "16px" / "200ms" / "-0.25px" are converted to numbers.
 *  - Color values are emitted as-is (hex strings, possibly with alpha).
 *  - Arrays are resolved element-wise (used for cubic-bezier control points).
 *  - Spring presets may use `$type: "springTF"` with `{ tension, friction }` only;
 *    the token build expands those to Reanimated stiffness/damping (+ defaults).
 *      { fontFamily: "Noontree-Bold", fontSize, fontWeight, lineHeight,
 *        letterSpacing, textTransform?, textDecorationLine? }
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ---------- paths ----------

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, "../src/raw");
const OUT_DIR = resolve(__dirname, "../src");

// ---------- types ----------

type Leaf = { $type: string; $value: unknown };
type Tree = { [k: string]: Tree | Leaf };

const isLeaf = (n: unknown): n is Leaf =>
  typeof n === "object" && n !== null && "$type" in (n as object) && "$value" in (n as object);

// ---------- load ----------

const base = JSON.parse(readFileSync(resolve(RAW_DIR, "base.json"), "utf8")) as Tree;
const semantic = JSON.parse(readFileSync(resolve(RAW_DIR, "semantic.json"), "utf8")) as Tree;
const textStyles = JSON.parse(readFileSync(resolve(RAW_DIR, "text-styles.json"), "utf8")) as Tree;

// Merged lookup tree for resolving {a.b.c} references. Top-level keys come from
// every source: base.json contributes "base", semantic.json contributes "colour",
// "font", "space", and text-styles.json contributes "Heading", "Body", "Action".
const lookup: Tree = { ...base, ...semantic, ...textStyles };

// ---------- resolution ----------

const REF = /^\{([^}]+)\}$/;

function resolveRef(path: string, seen = new Set<string>()): unknown {
  if (seen.has(path)) throw new Error(`Cycle in token reference: ${path}`);
  seen.add(path);
  const parts = path.split(".");
  let node: Tree | Leaf = lookup;
  for (const p of parts) {
    if (isLeaf(node) || node[p] === undefined) {
      throw new Error(`Unresolved reference: {${path}}`);
    }
    node = node[p];
  }
  return resolveValue(node, seen);
}

function resolveValue(node: Tree | Leaf | unknown, seen = new Set<string>()): unknown {
  if (typeof node === "string") {
    const m = node.match(REF);
    return m ? resolveRef(m[1], new Set(seen)) : node;
  }
  if (isLeaf(node)) {
    const v = resolveValue(node.$value, seen);
    return castByType(node.$type, v);
  }
  if (Array.isArray(node)) {
    return node.map((item) => resolveValue(item, seen));
  }
  if (typeof node === "object" && node !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = resolveValue(v, seen);
    return out;
  }
  return node;
}

/** Prototype tension/friction → Reanimated stiffness/damping (+ shared rest defaults). */
function expandSpringTF(value: Record<string, unknown>): Record<string, unknown> {
  const tension = Number(value.tension);
  const friction = Number(value.friction);
  if (!Number.isFinite(tension) || !Number.isFinite(friction)) {
    throw new Error(`springTF expects numeric tension & friction, got ${JSON.stringify(value)}`);
  }
  const mass = value.mass !== undefined ? Number(value.mass) : 1;
  return {
    stiffness: tension,
    damping: friction,
    mass,
    overshootClamping:
      typeof value.overshootClamping === "boolean" ? value.overshootClamping : false,
    restDisplacementThreshold:
      value.restDisplacementThreshold !== undefined
        ? Number(value.restDisplacementThreshold)
        : 0.01,
    restSpeedThreshold:
      value.restSpeedThreshold !== undefined ? Number(value.restSpeedThreshold) : 0.01,
  };
}

function castByType(type: string, value: unknown): unknown {
  if (type === "dimension" && typeof value === "string") {
    const n = parseFloat(value.replace(/(px|ms)$/i, ""));
    return Number.isNaN(n) ? value : n;
  }
  if (type === "cubicBezier") {
    if (!Array.isArray(value) || value.length !== 4) {
      throw new Error(`cubicBezier expected a 4-number array, got ${JSON.stringify(value)}`);
    }
    return value.map((x) => Number(x)) as unknown;
  }
  if (type === "spring" && typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as unknown;
  }
  if (type === "springTF" && typeof value === "object" && value !== null && !Array.isArray(value)) {
    return expandSpringTF(value as Record<string, unknown>);
  }
  if (type === "typography" && typeof value === "object" && value !== null) {
    return toRNTextStyle(value as Record<string, unknown>);
  }
  return value;
}

// ---------- typography → RN ----------

const WEIGHT_TO_NUMERIC: Record<string, string> = {
  Light: "300",
  Regular: "400",
  Medium: "500",
  SemiBold: "600",
  Bold: "700",
  ExtraBold: "800",
  Black: "900",
};

function toRNTextStyle(t: Record<string, unknown>): Record<string, unknown> {
  const family = String(t.fontFamily ?? "Noontree");
  const weight = String(t.fontWeight ?? "Regular");
  // We deliberately emit `fontWeight: "400"` for every face, even though the
  // semantic weight (Light → Black) is encoded in the family name. Reason:
  // expo-font's web font loader registers each Noontree-* face at the default
  // weight 400, and the browser synthesises faux-bold whenever a non-400
  // numeric weight is applied on top of a 400-registered face — turning every
  // SemiBold (or higher) label into visually-Bold text. Setting "400" here
  // tells the browser "use the face as registered" — no synthesis. The
  // intended visual weight comes from the family name itself
  // (Noontree-SemiBold, Noontree-Bold, etc.).
  // WEIGHT_TO_NUMERIC is kept above for reference / future use if expo-font
  // ever starts emitting `font-weight:` descriptors in its @font-face entries.
  void WEIGHT_TO_NUMERIC;
  const out: Record<string, unknown> = {
    fontFamily: `${family}-${weight}`,
    fontSize: t.fontSize,
    fontWeight: "400",
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
  };
  if (t.textTransform && t.textTransform !== "none") out.textTransform = t.textTransform;
  if (t.textDecoration && t.textDecoration !== "none") out.textDecorationLine = t.textDecoration;
  return out;
}

// ---------- emit ----------

function serialize(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map((v) => serialize(v, indent + 1)).join(", ")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([k, v]) => `${padInner}${safeKey(k)}: ${serialize(v, indent + 1)}`);
    return `{\n${lines.join(",\n")},\n${pad}}`;
  }
  return JSON.stringify(value);
}

function safeKey(k: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
}

function resolveTopLevel(tree: Tree): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(tree)) out[k] = resolveValue(v);
  return out;
}

function emit(file: string, body: string) {
  const banner =
    `// AUTO-GENERATED by packages/tokens/scripts/build-tokens.ts\n` +
    `// Source: packages/tokens/src/raw/*.json\n` +
    `// Do not edit by hand — run \`pnpm --filter @field-ds/tokens build\` to regenerate.\n\n`;
  writeFileSync(resolve(OUT_DIR, file), banner + body);
}

// ----- base.ts -----

const baseResolved = resolveTopLevel(base) as { base: Record<string, unknown> };
emit(
  "base.ts",
  `export const base = ${serialize(baseResolved.base)} as const;\n` +
    `export type Base = typeof base;\n`,
);

// ----- semantic.ts -----

const semanticResolved = resolveTopLevel(semantic);
const semanticBody = Object.entries(semanticResolved)
  .map(
    ([k, v]) =>
      `export const ${safeKey(k.replace(/-/g, "_"))} = ${serialize(v)} as const;\n` +
      `export type ${pascal(k)} = typeof ${safeKey(k.replace(/-/g, "_"))};\n`,
  )
  .join("\n");
emit("semantic.ts", semanticBody);

// ----- text-styles.ts -----

const textResolved = resolveTopLevel(textStyles);
// Flatten: { H40: { Bold: <style> } } → { H40_Bold: <style> }
const flat: Record<string, unknown> = {};
function flatten(obj: Record<string, unknown>, prefix: string[] = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v) &&
      !("fontFamily" in (v as object))
    ) {
      flatten(v as Record<string, unknown>, [...prefix, k]);
    } else {
      flat[[...prefix, k].join("_")] = v;
    }
  }
}
flatten(textResolved as Record<string, unknown>);

const textBody =
  `// Minimal subset of react-native's TextStyle so this package stays RN-agnostic.\n` +
  `// Consumers can cast/widen to RN's TextStyle at the call site.\n` +
  `export type FieldTextStyle = {\n` +
  `  fontFamily: string;\n` +
  `  fontSize: number;\n` +
  `  fontWeight: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";\n` +
  `  lineHeight: number;\n` +
  `  letterSpacing: number;\n` +
  `  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";\n` +
  `  textDecorationLine?: "none" | "underline" | "line-through" | "underline line-through";\n` +
  `};\n\n` +
  `export const textStyles = ${serialize(flat)} as const satisfies Record<string, FieldTextStyle>;\n\n` +
  `export type TextStyleName = keyof typeof textStyles;\n\n` +
  Object.keys(flat)
    .map((k) => `export const ${k} = textStyles.${k};`)
    .join("\n") +
  `\n`;
emit("text-styles.ts", textBody);

// ----- index.ts -----

emit(
  "index.ts",
  `export * from "./base";\n` +
    `export * from "./semantic";\n` +
    `export * from "./text-styles";\n` +
    `export * from "./springFromTF";\n`,
);

console.log(
  `✔ Generated base.ts, semantic.ts, text-styles.ts (${Object.keys(flat).length} text styles), index.ts`,
);

// ---------- helpers ----------

function pascal(s: string): string {
  return s
    .split(/[-_]/g)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}
