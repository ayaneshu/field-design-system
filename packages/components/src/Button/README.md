# Button

Action controls for triggering primary, secondary, and supportive actions across noon flows. Maps to the Figma `M-Button/*` family — Primary, Secondary, Secondary-Neutral, Neutral, Round-Neutral, Text-Blue, Text-Neutral, and IconButton.

## Storybook

[View Button stories in Storybook](../../../../apps/storybook/src/stories/Button.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the **Components / Button** group in the sidebar — covers `Button`, `RoundButton`, `TextButton`, and `IconButton`.

## Components

| Component     | Figma                                | When to use                                                                 |
| ------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `Button`      | `M-Button/Primary`, `Secondary`, `Secondary-Neutral`, `Neutral` | Rectangular text+icon CTAs. Pick `variant` to set emphasis.            |
| `RoundButton` | `M-Button/Round-Neutral-Button`      | Pill-shaped neutral CTA for toolbars, map chips, sticky headers.            |
| `TextButton`  | `M-Button/Text-Blue`, `Text-Neutral` | Low-emphasis inline action ("View all", row-level "Edit").                  |
| `IconButton`  | `M-IconButton`                       | Square circular icon-only button (back chevrons, close, overflow controls). |

## Usage

```tsx
import {
  Button,
  RoundButton,
  TextButton,
  IconButton,
} from "@field-ds/components";

<Button label="Continue" variant="primary" />
<Button label="Cancel" variant="secondary" />
<Button label="Schedule" variant="neutral" iconLeft="system-plus" />
<Button label="Saving" variant="primary" loading />
<Button label="Unavailable" variant="primary" disabled />

<RoundButton label="Filter" iconLeft="system-plus" />
<TextButton label="View all" iconRight="system-arrow-right" />
<IconButton icon="system-arrow-right" accessibilityLabel="Next" />
```

## Sizes

| Size  | Use                                            | Type | Icon |
| ----- | ---------------------------------------------- | ---- | ---- |
| `H56` | Sheet / full-width CTAs                        | A17  | 24   |
| `H52` | Inline content actions                         | A16  | 24   |
| `H48` | Inline content actions                         | A14  | 20   |
| `H40` | Dense inline actions                           | A12  | 16   |
| `H36` | Rows / tables / compact contexts               | A12  | 16   |
| `H32` | Toolbars (only on `variant="neutral"` per DS) | A12  | 16   |

`RoundButton` ships in `H40` / `H36`. `TextButton` ships in `A14` / `A12`. `IconButton` ships in `H40` / `H36`.

## States

All filled / outline buttons support **default**, **pressed**, **loader**, and **disabled** states. Loader keeps the footprint by stamping a centred spinner over the content (label + icons fade to opacity 0 — the button doesn't reflow).

`TextButton` and `IconButton` ship without a `loader` state per Figma — use `Button` if you need a loading spinner.

## Props (Button)

| Prop                 | Type                                                     | Default      | Notes                                              |
| -------------------- | -------------------------------------------------------- | ------------ | -------------------------------------------------- |
| `label`              | `string`                                                 | —            | Required visible label.                            |
| `variant`            | `"primary" \| "secondary" \| "secondary-neutral" \| "neutral"` | `"primary"`  | Emphasis level.                                    |
| `size`               | `"H56" \| "H52" \| "H48" \| "H40" \| "H36" \| "H32"`     | `"H56"`      | `H32` is only valid on `variant="neutral"`.        |
| `iconLeft`           | `IconName`                                               | —            | Glyph from `@field-ds/icons`.                      |
| `iconRight`          | `IconName`                                               | —            | Glyph from `@field-ds/icons`.                      |
| `loading`            | `boolean`                                                | `false`      | Shows centred spinner; preserves footprint.        |
| `disabled`           | `boolean`                                                | `false`      | Non-interactive, muted colour.                     |
| `fullWidth`          | `boolean`                                                | `false`      | Stretches to fill parent width.                    |
| `onPress`            | `() => void`                                             | —            | Tap handler.                                       |
| `accessibilityLabel` | `string`                                                 | label        | Falls back to `label`.                             |
| `style`              | `StyleProp<ViewStyle>`                                   | —            | Forwarded to outer `Pressable`.                    |

See `Button.tsx`, `RoundButton.tsx`, `TextButton.tsx`, and `IconButton.tsx` for the full per-component prop reference.

## Tokens used

- `colour.surface.action-bold`, `surface.action-extrabold`, `surface.action-subtle` — Primary fill, pressed, Secondary pressed
- `colour.surface.primary-inverted`, `surface.secondary-inverted` — Neutral fill / pressed
- `colour.surface.primary`, `surface.secondary` — base / pressed surface for outline + disabled
- `colour.border.action`, `border.primary`, `border.subtle` — outline borders
- `colour.text-n-icon.on-surface-bold` — label on dark / blue fills
- `colour.text-n-icon.action` — Secondary + Text-Blue label
- `colour.text-n-icon.primary` — Secondary-Neutral + Text-Neutral label
- `colour.text-n-icon.muted` — disabled label / icon
- `radius.6` / `radius.8` / `radius.10` / `radius.12` / `radius.rounded` — corner per height
- `space.4` … `space.24` — gap + padding per height
- `textStyles.Action_A12_SemiBold` … `Action_A17_SemiBold` — label per height
