# Accordion

Disclosure control that reveals supplementary content on tap. Maps to the Figma `M-Accordion` component.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/Accordion.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the Accordion stories in the sidebar.

## Usage

```tsx
import { Accordion } from "@field-ds/components";
import { Icon } from "@field-ds/icons";

// Uncontrolled
<Accordion title="Delivery" body="Same-day delivery available across UAE." />

// With initial open state
<Accordion
  title="Returns policy"
  body="Returns accepted within 14 days."
  defaultExpanded
/>

// Controlled
<Accordion
  title="Specifications"
  body={<SpecsTable />}
  expanded={open}
  onExpandedChange={setOpen}
  iconLeft={<Icon name="system-info" size={20} />}
/>
```

## Props

| Prop                | Type                          | Default | Notes                                                              |
| ------------------- | ----------------------------- | ------- | ------------------------------------------------------------------ |
| `title`             | `string`                      | —       | Header text. Truncates to one line.                                |
| `body`              | `ReactNode`                   | —       | String renders as `Body_B14_Regular`; nodes render as-is.          |
| `expanded`          | `boolean`                     | —       | Controlled open state. Omit to use uncontrolled.                   |
| `defaultExpanded`   | `boolean`                     | `false` | Initial open state in uncontrolled mode.                           |
| `onExpandedChange`  | `(next: boolean) => void`     | —       | Fires after the user toggles.                                      |
| `iconLeft`          | `ReactNode`                   | —       | Optional 20×20 icon shown left of the title.                       |
| `style`             | `StyleProp<ViewStyle>`        | —       | Forwarded to the outer container.                                  |

## Animation

Apple-style ease-out (`cubic-bezier(0.32, 0.72, 0, 1)`). 320ms on open, 260ms on close — closes a touch quicker, matching Apple's pattern.

The body renders at its intrinsic size; an animated wrapper with `overflow: hidden` reveals it by uncovering rather than stretching, so text never reflows mid-animation. Body height is sampled once via a hidden measurement layer.

## Tokens used

- `colour.surface.primary` (container)
- `colour.surface.secondary` (header + body fill)
- `colour.text-n-icon.primary` (title, body text, chevron)
- `space.1 / 4 / 8 / 12 / 20 / 44`, `radius.12`, `textStyles.Body_B14_SemiBold`, `textStyles.Body_B14_Regular`
