# BottomNav

Primary bottom tab bar — one tab is active at a time and drives the highlight, icon, and label colour. Active state automatically swaps the icon to its `-filled` sibling. Maps to the Figma `M-Bottomnav` component.

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/BottomNav.stories.tsx)

Run locally:

```bash
pnpm --filter storybook dev
```

Then open the BottomNav stories in the sidebar.

## Usage

```tsx
import { BottomNav } from "@field-ds/components";

<BottomNav
  tabs={[
    { key: "home", label: "Home", icon: "bottomnav-home" },
    { key: "categories", label: "Categories", icon: "bottomnav-categories" },
    { key: "cart", label: "Cart", icon: "bottomnav-cart" },
  ]}
  activeKey={tab}
  onTabPress={setTab}
/>
```

Use once per screen at the bottom of primary tabbed flows. Don't stack above other fixed footers — the bottom nav owns that region.

## Props

| Prop          | Type                       | Default | Notes                                                   |
| ------------- | -------------------------- | ------- | ------------------------------------------------------- |
| `tabs`        | `BottomNavTab[]`           | —       | 3–5 tabs (warns in dev outside that range)              |
| `activeKey`   | `string`                   | —       | Must match one of `tabs[].key`                          |
| `onTabPress`  | `(key: string) => void`    | —       | Fires when a tab is pressed                             |
| `showHomeBar` | `boolean`                  | `true`  | Show the iOS home indicator below the tabs              |
| `style`       | `StyleProp<ViewStyle>`     | —       | Forwarded to the outer container                        |

## Constraints

- **Min 3, max 5 tabs.** Below 3 reads as a row of buttons; above 5 the labels truncate (Apple/Material parity).
- **Icons must be `bottomnav-*`.** Only those have a guaranteed `-filled` sibling, which the active state derives. Use `bottomNavIconNames` for the runtime list.

## Tokens used

- `colour.surface.primary` (container background)
- `colour.text-n-icon.action` (active highlight, icon, label)
- `colour.text-n-icon.tertiary` (inactive icon, label)
- `colour.text-n-icon.primary` (home indicator)
- `space.4 / 6 / 8 / 12 / 16 / 24 / 32`, `radius.2 / 8`, `textStyles.Body_B11_*`
