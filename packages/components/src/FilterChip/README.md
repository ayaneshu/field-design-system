# FilterChip

Height-36 filter / sort chip. Maps to the Figma `M-FilterChip` component.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/FilterChip.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

## Usage

```tsx
import { FilterChip } from "@field-ds/components";

<FilterChip label="Filter" onPress={openSheet} />
<FilterChip label="Sort" iconLeft="system-sort" onPress={openSort} />
<FilterChip
  label="Filter"
  count="(4)"
  added
  onPress={openSheet}
  onClear={clearAll}
/>

// Static applied-filter pill (no caret, just a dismiss cross).
<FilterChip
  label="Delivered"
  showIconLeft={false}
  iconRight="system-cross"
  onPress={removePill}
/>

// Slot variant — drop any node into the 20×20 slot.
<FilterChip content="slot" onPress={openBrand}>
  <Image source={brandLogo} style={{ width: 20, height: 20 }} />
</FilterChip>
```

## Props

| Prop                 | Type                          | Default                | Notes                                                              |
| -------------------- | ----------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `content`            | `"label" \| "slot"`           | `"label"`              | `slot` exposes a 20×20 child slot                                  |
| `label`              | `string`                      | `"Filter"`             | Verb-first, short                                                  |
| `count`              | `string`                      | —                      | Pre-formatted (e.g. `"(4)"`). Only renders when `added` is true    |
| `showIconLeft`       | `boolean`                     | `true`                 | Toggle the left icon                                               |
| `showIconRight`      | `boolean`                     | `true`                 | Toggle the right caret (also applies in `added`)                   |
| `iconLeft`           | `IconName`                    | `"system-preferences"` | Any glyph from `@field-ds/icons`                                   |
| `iconRight`          | `IconName`                    | `"system-caret-down"`  | Any glyph from `@field-ds/icons`                                   |
| `added`              | `boolean`                     | `false`                | Switches to the bordered "Added" treatment + clear-all cross       |
| `disabled`           | `boolean`                     | `false`                | Non-interactive, muted colour                                      |
| `onPress`            | `() => void`                  | —                      | Open filter sheet / picker                                         |
| `onClear`            | `() => void`                  | —                      | Fires from the trailing cross when `added` is true                 |
| `children`           | `ReactNode`                   | —                      | Slot contents — image, SVG, brand mark, anything                   |
| `accessibilityLabel` | `string`                      | `label`                | Screen reader label                                                |
| `style`              | `StyleProp<ViewStyle>`        | —                      | Forwarded to the outer `Pressable`                                 |

## Tokens used

- `radius/8` (corners), `radius/2` (divider)
- `space/10` (padding-x), `space/8` (padding-y), `space/4` (gap), `space/2` (divider margin)
- `colour.surface.primary` (Default / Added background)
- `colour.surface.secondary` (Pressed / Disabled background)
- `colour.border.subtle` (Default / Pressed / Disabled border, divider)
- `colour.border.extrabold` (Added border)
- `colour.text-n-icon.primary` (Default / Pressed / Added foreground)
- `colour.text-n-icon.muted` (Disabled foreground)
- `Action_A14_SemiBold` (label and count text style)

## Do not use

- As a selection tag (use a selection chip).
- As a primary CTA (use `Button`).
- In multi-select toggle groups.
- For a single applied filter pill (e.g. `Delivered ×`), use the default state with `showIconLeft={false}` and `iconRight="system-cross"` — not `added`.
