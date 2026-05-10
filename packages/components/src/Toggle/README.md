# Toggle

Binary on/off control with a sliding thumb. Field DS source: `M-Toggle`.

`Switch` (already in this package) is a segmented control mapped from Figma's `M-Switch` — different component. Use `Toggle` for true binary state.

## Usage

```tsx
import { Toggle } from "@field-ds/components";

// Uncontrolled
<Toggle defaultOn={false} onChange={(on) => console.log(on)} accessibilityLabel="Notifications" />

// Controlled
const [on, setOn] = useState(false);
<Toggle on={on} onChange={setOn} accessibilityLabel="Wi-Fi" />
```

Always pair with a visible label or pass `accessibilityLabel`.

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `on` | `boolean` | — | Controlled value. Omit for uncontrolled. |
| `defaultOn` | `boolean` | `false` | Initial value in uncontrolled mode. |
| `onChange` | `(on: boolean) => void` | — | Fires after a tap when not disabled. |
| `size` | `"H16" \| "H20" \| "H24"` | `"H20"` | H16 compact · H20 standard · H24 prominent. |
| `disabled` | `boolean` | `false` | Non-interactive; thumb dims to `surface.tertiary`. |
| `accessibilityLabel` | `string` | — | Required when no visible label is paired. |
| `accessibilityHint` | `string` | — | Optional. |
| `style` | `StyleProp<ViewStyle>` | — | Layout-level escape hatch only. |
| `testID` | `string` | — | |

## Tokens

- Track ON: `colour.surface["secondary-inverted"]`
- Track OFF (and disabled-ON): `colour.surface.muted`
- Thumb: `colour.surface.primary` (default), `colour.surface.tertiary` (disabled)
- Radius: `radius.rounded`
- Padding: `space["2"]`
- Thumb size: `space["12"]` / `space["16"]` / `space["20"]` for H16/H20/H24

## Motion

Thumb slides 220 ms with the system Apple ease (`cubic-bezier(0.32, 0.72, 0, 1)`); the track crossfades over the same window. Honors `useReducedMotion()` by snapping. RTL-aware via `I18nManager.isRTL`.

## Storybook

`Components/Toggle` — Default, On, Disabled, DisabledOn, Sizes (full grid), Controlled.
