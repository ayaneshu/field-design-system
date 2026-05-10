# SearchBar

`M-SearchBar` — single-line search input. Two sizes (H48 / H44), optional Sm
elevation, and up to two trailing icon slots with an auto-divider.

```tsx
import { SearchBar } from "@field-ds/components";
import { Icon } from "@field-ds/icons";

<SearchBar onSubmit={runSearch} />

<SearchBar
  size="H44"
  iconLeft={<Icon name="system-arrow-left" size={20} />}
  iconRight={<Icon name="system-camera" size={20} />}
/>

<SearchBar
  elevation
  iconRight={<Icon name="system-filter" size={24} />}
  iconRightTwo={<Icon name="system-microphone" size={24} />}
/>
```

## Props

| Prop              | Type                              | Default                            | Notes |
| ----------------- | --------------------------------- | ---------------------------------- | ----- |
| `value`           | `string`                          | —                                  | Controlled value. |
| `defaultValue`    | `string`                          | `""`                               | Uncontrolled initial value. |
| `onChangeText`    | `(next: string) => void`          | —                                  | Fires on every keystroke. |
| `onSubmit`        | `(value: string) => void`         | —                                  | Fires on keyboard return. |
| `onClear`         | `() => void`                      | —                                  | Fires when the auto-clear button is pressed. |
| `showClearButton` | `boolean`                         | `true`                             | Auto-clear icon when value is non-empty and `iconRight` is not provided. |
| `size`            | `"H48" \| "H44"`                  | `"H48"`                            | H48 → 24px icons + B14 text. H44 → 20px + B12. |
| `elevation`       | `boolean`                         | `false`                            | Sm shadow when true. |
| `placeholder`     | `string`                          | `"Search for your building, area..."` | |
| `iconLeft`        | `ReactNode \| null`               | search glyph                        | `null` removes the leading icon. |
| `iconRight`       | `ReactNode`                       | auto-clear when value is non-empty | Custom override always wins. |
| `iconRightTwo`    | `ReactNode`                       | —                                   | When set, an auto-divider is rendered before it. |
| `editable`        | `boolean`                         | `true`                              | |
| `autoFocus`       | `boolean`                         | `false`                             | |
| `returnKeyType`   | `TextInputProps["returnKeyType"]` | `"search"`                          | |

State (Placeholder / Active / Typing / Typed) is **derived** from focus + value
and never accepted as a prop, mirroring `InputText`.

## Tokens

| Surface  | Border        | Text                          | Caret                         | Radius / spacing                 | Type                |
| -------- | ------------- | ----------------------------- | ----------------------------- | -------------------------------- | ------------------- |
| `colour.surface.primary` | `colour.border.subtle` | `colour["text-n-icon"].primary` / `tertiary` | `colour.surface["action-bold"]` | `radius["12"]`, `space["8"\|"10"\|"12"]` | `Body_B14_Medium` (H48), `Body_B12_Medium` (H44) |

## Storybook

`apps/storybook/src/stories/SearchBar.stories.tsx` — Default, sizes, with-value,
with elevation, with two trailing icons, PDP back-header pattern.

## Figma

[M-SearchBar — 892:244](https://www.figma.com/design/wFRKiKskxZ4vjIHbDVvngJ/Field-Design-System?node-id=892-244)

## Accessibility

- `accessibilityRole="search"` on the input.
- `accessibilityLabel` defaults to the placeholder.
- The auto-clear icon is announced as **"Clear search"** with role `button`.
- `accessibilityState={{ disabled: !editable }}`.

No motion is gated by reduced-motion — this component has no animation timeline.
