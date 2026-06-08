# RatingInput

Interactive 5-star rating input with optional emoji feedback at the selected
star. Maps to the Figma `M-Rating/Input` component (`1214:646`).

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/RatingInput.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

## Figma

[M-Rating/Input — node 1214:646](https://www.figma.com/design/wFRKiKskxZ4vjIHbDVvngJ/Field-Design-System?node-id=1214-646)

## Usage

```tsx
import { RatingInput } from "@field-ds/components";

// Uncontrolled
<RatingInput onChange={setRating} />

// Controlled
<RatingInput value={rating} onChange={setRating} size={32} />

// No emoji at the selected position
<RatingInput defaultValue={4} emojis={false} />

// Custom emoji
<RatingInput emoji="🎉" />
```

Tap a star to set the rating. Tapping the currently selected star clears
back to zero (no separate clear control).

## Props

| Prop                 | Type                          | Default | Notes                                                       |
| -------------------- | ----------------------------- | ------- | ----------------------------------------------------------- |
| `value`              | `number`                      | —       | Controlled value, 0–5. Omit for uncontrolled mode.          |
| `defaultValue`       | `number`                      | `0`     | Initial value in uncontrolled mode.                         |
| `onChange`           | `(next: number) => void`      | —       | Fires after a star is tapped.                               |
| `size`               | `20 \| 28 \| 32`              | `28`    | Star px. 20 inline, 28 default review, 32 large CTA.        |
| `emojis`             | `boolean`                     | `false` | Show an emoji at the selected star.                         |
| `emoji`              | `string`                      | `"😊"`   | Override the emoji glyph.                                   |
| `disabled`           | `boolean`                     | `false` | Non-interactive, muted colour.                              |
| `accessibilityLabel` | `string`                      | —       | Defaults to `"Rating, N out of 5"`.                         |
| `style`              | `StyleProp<ViewStyle>`        | —       | Forwarded to the outer `View` (the row).                    |

Out-of-range `value` clamps to 0–5; non-integers floor to whole stars.

## Tokens used

- `colour.surface.yellow-bold` — filled star gold (`#f5c400`)
- `colour["text-n-icon"].tertiary` — outline star grey
- `colour["text-n-icon"].muted` — disabled fill (filled & outline)
- `space["4"]` / `space["6"]` / `space["8"]` — gap between stars by size

### Cross-family token note

The filled star uses `colour.surface.yellow-bold` rather than a
`text-n-icon.*` token. The system's `text-n-icon` family currently exposes
only `yellow-light` (neon `#feee00`) and `yellow-dark` (brown `#a36200`),
neither of which matches the Figma gold. Once the DS adds
`text-n-icon.yellow-bold` (or equivalent), this should switch.

## Accessibility

- The container has `accessibilityRole="radiogroup"` with a derived label.
- Each star is a `radio` with label `"Rate N out of 5"`.
- `accessibilityState.checked` is true for filled and emoji stars.
- Press feedback (scale 0.92) is skipped under `useReducedMotion`.
- Emoji cross-fade is skipped under `useReducedMotion` (snaps instead).

## Related

- `M-Rating/Badge` — for displaying an average rating (read-only).
