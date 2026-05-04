# @field-ds/components

React Native components for the Field Design System.

## Status

**Empty by design.** Components are landed one at a time after the author verifies them in a consumer app (the playground or an internal product). This keeps the public surface small and prevents half-finished primitives from leaking into shipped apps.

## Adding a component

1. Build and verify locally — typically inside `apps/playground`.
2. Open a PR that:
   - Adds `src/<ComponentName>.tsx`
   - Re-exports it from `src/index.ts`
   - Adds a usage example to the playground
3. Reference any tokens via `@field-ds/tokens` and any icons via `@field-ds/icons` — components should not hardcode colors, typography, or SVG paths.

## Naming

Components follow the design system's `M-` prefix only at the Figma level. In code, drop the prefix: `M-Button` → `Button`, `M-Input` → `Input`. Variants are exposed as props, not as separate components, unless the variant changes the underlying primitive.
