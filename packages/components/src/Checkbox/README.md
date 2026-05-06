# Checkbox

Selection control for toggling items on or off. Maps to the Figma `M-Checkbox` component.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/Checkbox.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the Checkbox stories in the sidebar.

## Usage

```tsx
import { Checkbox } from "@field-ds/components";

<Checkbox selected={agreed} onChange={setAgreed} />
<Checkbox size="H20" defaultSelected />
<Checkbox disabled />
```

## Props

| Prop                 | Type                          | Default | Notes                                                 |
| -------------------- | ----------------------------- | ------- | ----------------------------------------------------- |
| `selected`           | `boolean`                     | —       | Controlled selected state                             |
| `defaultSelected`    | `boolean`                     | `false` | Initial value in uncontrolled mode                    |
| `onChange`           | `(next: boolean) => void`     | —       | Fires after the toggle                                |
| `size`               | `"H16" \| "H20" \| "H24"`     | `"H24"` | H24 default · H20 dense lists · H16 compact tables    |
| `disabled`           | `boolean`                     | `false` | Non-interactive, muted colour                         |
| `accessibilityLabel` | `string`                      | —       | Screen reader label when no visible label is nearby   |
| `style`              | `StyleProp<ViewStyle>`        | —       | Forwarded to the outer `Pressable`                    |

## Tokens used

- `colour.text-n-icon.primary` (selected fill)
- `colour.text-n-icon.tertiary` (default outline)
- `colour.text-n-icon.muted` (disabled selected)
- `colour.border.medium` (disabled outline)
- `colour.surface.primary` (tick glyph)
