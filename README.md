# Field Design System

The Field Design System for noon — design tokens, typography, icons, and React Native components.

> Maintained by the noon design team.

## Packages

| Package | Description |
| --- | --- |
| [`@field-ds/tokens`](./packages/tokens) | Design tokens — colors, typography, spacing — as JSON source-of-truth and generated TypeScript. |
| [`@field-ds/fonts`](./packages/fonts) | Noontree font family in OTF/WOFF/WOFF2 with Expo + web loaders. |
| [`@field-ds/icons`](./packages/icons) | M-Icon library — SVGs synced from Figma and exposed as React Native components. |
| [`@field-ds/components`](./packages/components) | React Native component library (added incrementally — see [contributing](#contributing)). |

## Apps

| App | Description |
| --- | --- |
| [`playground`](./apps/playground) | Expo app for previewing tokens, typography, icons, and components on device. |

## Quick start

```sh
# install
nvm use            # or use Node 20+
npm i -g pnpm@10
pnpm install

# build the tokens (regenerates TS from JSON)
pnpm build:tokens

# fetch icons from Figma (requires FIGMA_TOKEN in env)
pnpm fetch:icons
pnpm build:icons

# launch the playground
pnpm playground
```

## Repository layout

```
field-design-system/
├── packages/
│   ├── tokens/        JSON sources + generated TS exports
│   ├── fonts/         Noontree font assets
│   ├── icons/         M-Icon SVGs + RN components
│   └── components/    RN components (empty — added one at a time)
└── apps/
    └── playground/    Expo preview app
```

## Contributing

Components are intentionally added one at a time. Each new component is built and tested in a consumer app before landing in `@field-ds/components`. Open a PR against `main` once the component is verified.

## License

[MIT](./LICENSE)
