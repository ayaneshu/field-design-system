# Button family

Action controls for triggering primary, secondary, and supportive actions across noon flows. The four rectangular families each ship as their own component (matching Figma's M- components 1:1) and the round / text / icon families round out the set.

## Components

| Component                | Figma                       | When to use                                                                 |
| ------------------------ | --------------------------- | --------------------------------------------------------------------------- |
| `PrimaryButton`          | `M-PrimaryButton`           | Filled blue, highest emphasis. The single most important action on a screen. |
| `SecondaryButton`        | `M-SecondaryButton`         | Outline blue. Supportive action paired with a primary.                      |
| `SecondaryNeutralButton` | `M-SecondaryNeutralButton`  | Outline neutral. Quiet adjacent action where blue would compete.            |
| `NeutralButton`          | `M-NeutralButton`           | Filled near-black. Mid-emphasis alt to Primary on light surfaces.           |
| `RoundButton`            | `M-NeutralRoundButton`      | Pill-shaped neutral CTA for toolbars, map chips, sticky headers.            |
| `TextButton`             | `M-TextButtonBlue`          | Low-emphasis inline action with a blue label ("View all", row-level "Edit"). |
| `NeutralTextButton`      | `M-TextButtonNeutral`       | Same as `TextButton` but in the neutral text tone — for coloured / inverted surfaces or quiet inline actions. |
| `IconButton`             | `M-IconButton`              | Square circular icon-only button (back chevrons, close, overflow).          |

## Storybook

Each rectangular family has its own story file:

- [PrimaryButton stories](../../../../apps/storybook/src/stories/PrimaryButton.stories.tsx)
- [SecondaryButton stories](../../../../apps/storybook/src/stories/SecondaryButton.stories.tsx)
- [SecondaryNeutralButton stories](../../../../apps/storybook/src/stories/SecondaryNeutralButton.stories.tsx)
- [NeutralButton stories](../../../../apps/storybook/src/stories/NeutralButton.stories.tsx)
- [RoundButton stories](../../../../apps/storybook/src/stories/RoundButton.stories.tsx)
- [TextButton stories](../../../../apps/storybook/src/stories/TextButton.stories.tsx)
- [NeutralTextButton stories](../../../../apps/storybook/src/stories/NeutralTextButton.stories.tsx)
- [IconButton stories](../../../../apps/storybook/src/stories/IconButton.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

## Usage

```tsx
import {
  PrimaryButton,
  SecondaryButton,
  SecondaryNeutralButton,
  NeutralButton,
  RoundButton,
  TextButton,
  NeutralTextButton,
  IconButton,
} from "@field-ds/components";

<PrimaryButton label="Continue" />
<SecondaryButton label="Cancel" />
<SecondaryNeutralButton label="Skip" />
<NeutralButton label="Schedule" iconLeft="system-plus" />
<NeutralButton label="Compact" size="H32" />

<RoundButton label="Filter" iconLeft="system-plus" />
<TextButton label="View all" iconRight="system-arrow-right" />
<NeutralTextButton label="Dismiss" />
<IconButton icon="system-arrow-right" accessibilityLabel="Next" />
```

## Sizes

The rectangular families share a height scale per Figma:

| Size  | Use                                            | Type | Icon |
| ----- | ---------------------------------------------- | ---- | ---- |
| `H56` | Sheet / full-width CTAs                        | A17  | 24   |
| `H52` | Inline content actions                         | A16  | 24   |
| `H48` | Inline content actions                         | A14  | 20   |
| `H40` | Dense inline actions (per-variant footprint)   | A12 / A14 | 16 / 20 |
| `H36` | Rows / tables / compact contexts               | A12  | 16   |
| `H32` | Toolbars (only on `NeutralButton`)             | A12  | 16   |

`H40` is intentionally per-variant: `PrimaryButton` keeps the tighter 12px / radius 8 footprint with A12; the outline + neutral families expand to 16x10–12 / radius 10 / A12 (Secondary) or A14 (Secondary-Neutral, Neutral). See [`sizing.ts`](sizing.ts) for the exact specs and `BUTTON_SIZE_H40_OVERRIDES`.

`RoundButton` ships in `H40` / `H36`. `TextButton` and `NeutralTextButton` ship in `A14` / `A12`. `IconButton` ships in `H40` / `H36`.

## States

All rectangular + round buttons support **default**, **pressed**, **loader**, and **disabled** states. Loader keeps the footprint by stamping a centred spinner over the content (label + icons fade to opacity 0 — the button doesn't reflow).

`TextButton`, `NeutralTextButton`, and `IconButton` ship without a `loader` state per Figma — use one of the rectangular families if you need a loading spinner.

## Props (rectangular family — Primary / Secondary / Secondary-Neutral / Neutral)

| Prop                 | Type                   | Default      | Notes                                                |
| -------------------- | ---------------------- | ------------ | ---------------------------------------------------- |
| `label`              | `string`               | —            | Required visible label.                              |
| `size`               | family-specific union  | `"H56"`      | `H32` is only valid on `NeutralButton`.              |
| `iconLeft`           | `IconName`             | —            | Glyph from `@field-ds/icons`.                        |
| `iconRight`          | `IconName`             | —            | Glyph from `@field-ds/icons`.                        |
| `loading`            | `boolean`              | `false`      | Shows centred spinner; preserves footprint.          |
| `disabled`           | `boolean`              | `false`      | Non-interactive, muted colour.                       |
| `fullWidth`          | `boolean`              | `false`      | Stretches to fill parent width.                      |
| `onPress`            | `() => void`           | —            | Tap handler.                                         |
| `accessibilityLabel` | `string`               | label        | Falls back to `label`.                               |
| `style`              | `StyleProp<ViewStyle>` | —            | Forwarded to outer `Pressable`.                      |

See the per-component files (`PrimaryButton.tsx`, `SecondaryButton.tsx`, `SecondaryNeutralButton.tsx`, `NeutralButton.tsx`) for tone specifics, plus `RoundButton.tsx` / `TextButton.tsx` / `NeutralTextButton.tsx` / `IconButton.tsx` for those families' props.

## Tokens used

- `colour.surface.action-bold`, `surface.action-extrabold`, `surface.action-subtle` — Primary fill / pressed; Secondary pressed
- `colour.surface.primary-inverted`, `surface.secondary-inverted` — Neutral fill / pressed
- `colour.surface.primary`, `surface.secondary`, `surface.muted` — outline base / pressed; disabled background
- `colour.border.action`, `border.primary`, `border.subtle` — outline borders
- `colour.text-n-icon.on-surface-bold` — label on dark / blue fills
- `colour.text-n-icon.action` — Secondary + Text-Blue label
- `colour.text-n-icon.primary` — Secondary-Neutral default + Text-Neutral label
- `colour.text-n-icon.secondary` — Secondary-Neutral pressed
- `colour.text-n-icon.muted` — disabled label / icon
- `radius.6` / `radius.8` / `radius.10` / `radius.12` / `radius.rounded` — corner per height
- `space.4` … `space.24` — gap + padding per height
- `textStyles.Action_A12_SemiBold` … `Action_A17_SemiBold` — label per height
