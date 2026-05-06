# @field-ds/components

React Native components for the Field Design System.

## Layout

Each component lives in its own folder under `src/`:

```
src/
├── BottomNav/
│   ├── BottomNav.tsx
│   ├── README.md
│   └── index.ts
├── Checkbox/
│   ├── Checkbox.tsx
│   ├── README.md
│   └── index.ts
└── index.ts
```

The component's `README.md` is the source of truth for its API, tokens used, and Storybook entry. The package-level `index.ts` re-exports each component's public surface from its folder.

## Status

Components are landed one at a time after the author verifies them in a consumer app (the playground, Storybook, or an internal product). This keeps the public surface small and prevents half-finished primitives from leaking into shipped apps.

## Adding a component

1. Build and verify locally — typically inside `apps/playground` or `apps/storybook`.
2. Open a PR that:
   - Adds `src/<ComponentName>/<ComponentName>.tsx`
   - Adds `src/<ComponentName>/index.ts` re-exporting the public surface
   - Adds `src/<ComponentName>/README.md` with usage, props, tokens, and a Storybook link
   - Re-exports the component from `src/index.ts`
   - Adds `<ComponentName>.stories.tsx` to `apps/storybook/src/stories/`
   - Adds a usage example to the playground (optional but recommended)
3. Reference any tokens via `@field-ds/tokens` and any icons via `@field-ds/icons` — components should not hardcode colors, typography, or SVG paths.

## Naming

Components follow the design system's `M-` prefix only at the Figma level. In code, drop the prefix: `M-Button` → `Button`, `M-Input` → `Input`. Variants are exposed as props, not as separate components, unless the variant changes the underlying primitive.

## Storybook

Each shipped component has a Storybook story in `apps/storybook/src/stories/`. Run `pnpm --filter storybook dev` from the repo root.
