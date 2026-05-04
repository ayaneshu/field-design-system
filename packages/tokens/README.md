# @field-ds/tokens

Design tokens for the Field Design System — colors, typography, spacing.

## Structure

```
src/
├── raw/                Source-of-truth DTCG JSON (do not edit generated TS by hand)
│   ├── base.json       Primitives: color palettes, font family/weights, dimensional scale
│   ├── semantic.json   Aliases: text/icon/surface colors, font sizes, space scale
│   └── text-styles.json Typography composites (Heading/Body/Action × weights)
├── base.ts             Generated — primitives as nested const objects
├── semantic.ts         Generated — semantic tokens with refs resolved to literal values
├── text-styles.ts      Generated — RN-ready TextStyle objects (flat names, e.g. Heading_H40_Bold)
└── index.ts            Re-exports
```

## Usage

```ts
import { base, colour, space, textStyles, Heading_H40_Bold } from "@field-ds/tokens";

// primitive
base.colour.brand_blue["700"]; // "#0f61ff"

// semantic
colour.text_n_icon.primary;    // "#1d2539"
space["16"];                   // 16

// typography (RN TextStyle)
<Text style={Heading_H40_Bold}>Hello</Text>
// → { fontFamily: "Noontree-Bold", fontSize: 40, fontWeight: "700",
//      lineHeight: 48, letterSpacing: -0.25 }
```

> Text styles assume fonts are registered as `Noontree-{Weight}`. See [`@field-ds/fonts`](../fonts).

## Regenerate

```sh
pnpm --filter @field-ds/tokens build
```

The generator (`scripts/build-tokens.ts`):

- Loads the three JSON files and merges them into a single resolution tree.
- Resolves all `{a.b.c}` alias strings.
- Casts `dimension` values to plain `number` (strips `px`).
- Expands `typography` values to RN-compatible `TextStyle` objects.
