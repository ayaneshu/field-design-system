# Radio

Single-select control for mutually exclusive choices. Maps to the Figma `M-Radio` component.

Always render in a group of two or more — a lone radio is never correct. Always pair with a label; the dot alone is not a sufficient tap target. For multi-select, use [Checkbox](../Checkbox/README.md). For more than ~5 options, use a dropdown.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/Radio.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the Radio stories in the sidebar.

## Usage

```tsx
import { Radio } from "@field-ds/components";

// Controlled — typical group usage.
const [value, setValue] = useState<"fast" | "standard" | "economy">("standard");

<Radio selected={value === "fast"} onChange={() => setValue("fast")} />
<Radio selected={value === "standard"} onChange={() => setValue("standard")} />
<Radio selected={value === "economy"} onChange={() => setValue("economy")} />

// Uncontrolled — only useful when the value isn't read elsewhere.
<Radio defaultSelected size="H20" />

<Radio disabled />
```

Tapping an already-selected radio is a **no-op**. Deselection happens implicitly when another radio in the group is selected — the parent component is responsible for setting `selected={false}` on the previously-active radio.

## Props

| Prop                 | Type                          | Default | Notes                                                 |
| -------------------- | ----------------------------- | ------- | ----------------------------------------------------- |
| `selected`           | `boolean`                     | —       | Controlled selected state                             |
| `defaultSelected`    | `boolean`                     | `false` | Initial value in uncontrolled mode                    |
| `onChange`           | `(next: true) => void`        | —       | Fires only on transitions to `true`                   |
| `size`               | `"H16" \| "H20" \| "H24"`     | `"H24"` | H24 default · H20 dense lists · H16 compact tables    |
| `disabled`           | `boolean`                     | `false` | Non-interactive, muted colour                         |
| `accessibilityLabel` | `string`                      | —       | Screen reader label when no visible label is nearby   |
| `style`              | `StyleProp<ViewStyle>`        | —       | Forwarded to the outer `Pressable`                    |

## Tokens used

- `colour.text-n-icon.action` (selected disc, default state)
- `colour.text-n-icon.muted` (selected disc, disabled state)
- `colour.border.medium` (unselected outline)
- `colour.surface.primary` (unselected fill — also shows through the check cutout when selected)
- `colour.surface.secondary` (unselected fill, disabled)

The selected state is the literal Figma `M-Radio` SVG path (one per size — H16/H20/H24), shipped verbatim into the component. Each path is a filled disc with an evenodd-rule check cutout, so the check reveals the underlying surface rather than being drawn separately.

## Sizes

- **H24** — default. Use everywhere except the cases below.
- **H20** — dense lists and option groups.
- **H16** — compact tables only. Avoid on touch surfaces; pairs with an 8px hit-slop to keep the tap target reasonable.

## Accessibility

- `accessibilityRole="radio"` and `accessibilityState={{ selected, disabled }}` are set automatically.
- Pass `accessibilityLabel` when the radio sits without a visible adjacent label.
- The radio dot itself is not a full tap target — wrap it in a labelled `Pressable` for real touch surfaces.
