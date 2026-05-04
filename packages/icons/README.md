# @field-ds/icons

The M-Icon library — SVG sources synced from the [Field Design System Figma file](https://www.figma.com/design/wFRKiKskxZ4vjIHbDVvngJ/Field-Design-System?node-id=1-169) and exposed as a single React Native component.

## Usage

```tsx
import { Icon } from "@field-ds/icons";
import { colour } from "@field-ds/tokens";

<Icon name="system-arrow-up" size={20} color={colour["text-n-icon"].primary} />
```

`name` is type-checked against the `IconName` union — autocomplete shows every icon. `size` defaults to 24, `color` defaults to `#1D2539`.

## Layout

```
src/
├── svg/             Source SVGs (one per icon, kebab-case)
├── icons-data.ts    Generated — { iconPaths, IconName, iconNames }
├── Icon.tsx         Single RN component using react-native-svg
└── index.ts         Re-exports
```

## Naming convention

Figma names are flattened to a single kebab-cased slug:

| Figma node                                  | Slug                          |
| ------------------------------------------- | ----------------------------- |
| `M-Icon/System-Icon/arrow-up`               | `system-arrow-up`             |
| `M-Icon/System-Icon/cross-shield-filled`    | `system-cross-shield-filled`  |
| `M-Icon/Bottomnav-Icon/home/default`        | `bottomnav-home-default`      |
| `M-Icon/Bottomnav-Icon/home/selected`       | `bottomnav-home-selected`     |

## Sync from Figma

Get a [Figma personal access token](https://www.figma.com/developers/api#access-tokens), then:

```sh
FIGMA_TOKEN=figd_xxx pnpm fetch:icons
pnpm --filter @field-ds/icons build
```

`fetch` walks the Figma file's `1:169` page, exports every node named `M-Icon/...` as SVG, and writes each to `src/svg/<slug>.svg`. `build` regenerates `src/icons-data.ts` from those files.

## Peer dependencies

`react`, `react-native`, and `react-native-svg`. They're not bundled — provide them in your app.
