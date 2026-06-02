# Switch

Pill-shaped segmented control with 2–4 mutually-exclusive slots. Source: Figma `M-Switch` (node `1156:21346`).

> **Naming.** Figma calls this M-Switch but it's structurally a segmented control. If you also need React Native's boolean `Switch` in the same file, alias on import:
>
> ```ts
> import { Switch as DSSwitch } from "@field-ds/components";
> import { Switch as RNSwitch } from "react-native";
> ```

## Usage

```tsx
import { Switch } from "@field-ds/components";

// Boolean toggle (Off / On)
<Switch
  options={[
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ]}
  value={enabled}
  onChange={setEnabled}
/>

// Three slots, larger size
<Switch
  size="H48"
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
  defaultValue="week"
  onChange={setRange}
/>
```

## Props

| Prop                 | Type                                  | Default          | Description                                       |
| -------------------- | ------------------------------------- | ---------------- | ------------------------------------------------- |
| `options`            | `SwitchOption<T>[]`                   | —                | 2–4 slots. `{ value, label, accessibilityLabel? }`|
| `value`              | `T`                                   | —                | Controlled selected value.                        |
| `defaultValue`       | `T`                                   | `options[0].value` | Initial value when uncontrolled.                |
| `onChange`           | `(value: T) => void`                  | —                | Fires when the user picks a different slot.       |
| `size`               | `"H40" \| "H48"`                      | `"H40"`          | Track height.                                     |
| `disabled`           | `boolean`                             | `false`          | Drops opacity to 0.5 and ignores presses.         |
| `accessibilityLabel` | `string`                              | —                | Spoken name for the whole control (tablist).      |
| `style`              | `StyleProp<ViewStyle>`                | —                | Layout-level escape hatch (e.g. `width`).         |
| `testID`             | `string`                              | —                | Test handle.                                      |

`T` is unconstrained — `string`, `number`, or `boolean` all work.

## Sizes

| size  | track | thumb | font          |
| ----- | ----- | ----- | ------------- |
| `H40` | 40    | 32    | B12 SemiBold  |
| `H48` | 48    | 40    | B14 SemiBold  |

## Tokens

- `colour.surface.secondary` — track background
- `colour.surface.primary` — thumb background
- `colour["text-n-icon"].primary` — active label
- `colour["text-n-icon"].tertiary` — inactive label
- `radius.rounded` — pill rounding
- `space["4"]`, `space["10"]` — track padding, slot inner padding
- `textStyles.B12_SemiBold` (H40), `textStyles.B14_SemiBold` (H48)

## Motion

The thumb slides between slots with the Apple ease-out curve `bezier(0.32, 0.72, 0, 1)` over 220ms. With `useReducedMotion()` true, the thumb snaps without animation.

## Accessibility

- The track is a `tablist`.
- Each slot is a `tab` with `accessibilityState={{ selected, disabled }}`.
- Pass `accessibilityLabel` on the track for the spoken name; per-option `accessibilityLabel` overrides the visible label when needed.

## Storybook

`apps/storybook/src/stories/Switch.stories.tsx` — Default, H48, ThreeSlots, FourSlots, Disabled, Controlled, Sizes.

## Figma

[M-Switch on Figma](https://www.figma.com/design/wFRKiKskxZ4vjIHbDVvngJ/Field-Design-System?node-id=1156-21346)
