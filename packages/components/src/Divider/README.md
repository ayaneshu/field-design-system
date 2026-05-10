# Divider

Horizontal hairline used to separate content into distinct sections. Maps to the Figma `M-Divider` component.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/Divider.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the Divider stories in the sidebar.

## Usage

```tsx
import { Divider } from "@field-ds/components";

// Full-width, solid, low emphasis (default)
<Divider />

// Stronger contrast
<Divider emphasis="high" />

// Softer / optional break
<Divider variant="dashed" />

// Constrained width with left + right padding
<Divider width={320} paddingLeft={16} paddingRight={16} />

// Inset to align with content past a leading icon
<Divider paddingLeft={56} />
```

## Props

| Prop           | Type                       | Default   | Notes                                                                |
| -------------- | -------------------------- | --------- | -------------------------------------------------------------------- |
| `variant`      | `"solid" \| "dashed"`      | `"solid"` | Solid for standard separation; dashed for softer/optional breaks.    |
| `emphasis`     | `"low" \| "high"`          | `"low"`   | Low is the default; high reserved for stronger structural separation. |
| `width`        | `DimensionValue`           | `"100%"`  | Total span including padding. Number (px), percentage, or omit to fill parent. |
| `paddingLeft`  | `number`                   | `0`       | Inset from the left edge before the line starts.                     |
| `paddingRight` | `number`                   | `0`       | Inset from the right edge before the line ends.                      |
| `style`        | `StyleProp<ViewStyle>`     | —         | Forwarded to the outer container.                                    |

## Tokens used

- `colour.border.subtle` (low emphasis)
- `colour.border.primary` (high emphasis)
