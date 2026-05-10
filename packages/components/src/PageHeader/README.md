# PageHeader

Top-of-screen page header. One component, nine `type` values — pick the layout that matches the screen. Maps to the Figma `M-PageHeader` component set (`1753:285`).

## Storybook

[View in Storybook](../../../../apps/storybook/src/stories/PageHeader.stories.tsx)

```bash
pnpm --filter storybook dev
```

## Usage

```tsx
import { PageHeader } from "@field-ds/components";

// Standard left-aligned title with a share affordance.
<PageHeader
  type="title"
  title="Page title"
  onLeadingPress={goBack}
  trailing={[
    { icon: "system-upload", onPress: share, accessibilityLabel: "Share" },
  ]}
/>

// Modal-style centered title.
<PageHeader
  type="title-center"
  title="Settings"
  onLeadingPress={close}
  trailing={[
    { icon: "system-horizontal-three-dot-menu", onPress: openMenu, accessibilityLabel: "More" },
  ]}
/>

// Inline search field (64-tall variant).
<PageHeader
  type="search-bar"
  searchPlaceholder="Search for your building, area..."
  searchValue={query}
  onSearchChangeText={setQuery}
/>

// Tap-to-open search pill.
<PageHeader
  type="search-pill"
  onLeadingPress={goBack}
  searchPlaceholder="Search"
  onSearchPillPress={openSearch}
  trailing={[{ icon: "system-heart", onPress: openSaved, accessibilityLabel: "Saved" }]}
/>

// Address selector with a subtitle below.
<PageHeader
  type="location"
  onLeadingPress={goBack}
  addressLabel="Home"
  subtitle="Villa 52, Springville, K, VGP Layout"
  onAddressPress={openAddressPicker}
  trailing={[{ icon: "system-heart", onPress: openSaved, accessibilityLabel: "Saved" }]}
/>

// Breadcrumb-style location, no leading slot.
<PageHeader
  type="breadcrumb"
  addressLabel="Home"
  path="- BDA Complex, 100 Feet Rd Block, Koramangla"
  onAddressPress={openAddressPicker}
  trailing={[{ icon: "system-heart", onPress: openSaved, accessibilityLabel: "Saved" }]}
/>

// Minimal — back chevron only.
<PageHeader type="back-only" onLeadingPress={goBack} />

// Cluster of trailing icons.
<PageHeader
  type="icons"
  onLeadingPress={goBack}
  trailing={[
    { icon: "system-search", onPress: openSearch, accessibilityLabel: "Search" },
    { icon: "system-heart", onPress: openSaved, accessibilityLabel: "Saved" },
    { icon: "system-upload", onPress: share, accessibilityLabel: "Share" },
  ]}
/>
```

## Types

| `type` | Layout | Trailing | Notes |
|---|---|---|---|
| `title` | Leading + (image?) + title (+ subtitle?) + trailing | up to 3 | `imageSource` opens the 38×38 image slot. |
| `title-center` | Leading + centered title (+ subtitle?) + trailing | 1 | Modal-style header. |
| `search-bar` | Inline search field | — | 64-tall. No leading slot. |
| `search-pill` | Leading + search pill + trailing | up to 3 | Pill is tap-to-open. |
| `search-pill-wide` | Leading + wider search pill + trailing | up to 3 | Pill stretches to fill remaining space. |
| `location` | Leading + (icon + label + chevron + subtitle) + trailing | 1 | Address selector. |
| `breadcrumb` | Home icon + label + path + chevron + trailing | 1 | No separate leading slot — the address row is the leading affordance. |
| `back-only` | Ghost back chevron | — | Minimal. |
| `icons` | Leading + 1–3 trailing icons (right-aligned cluster) | up to 3 | No central content. |

## Props

- `type` — required. Drives layout.
- `title`, `subtitle` — used by `title`, `title-center`, `location` (subtitle).
- `imageSource` — `title` only. 38×38, `radius["8"]`, defaults to `surface.tertiary` background while loading.
- `leadingIcon` — defaults to `system-chevron-left`. Ignored by `search-bar` and `breadcrumb`.
- `onLeadingPress`, `leadingAccessibilityLabel` — leading affordance.
- `trailing` — array of `{ icon, onPress, accessibilityLabel }`. Capped at 3 (extras dropped with a dev warning).
- `addressLabel`, `addressIcon`, `onAddressPress`, `path` — `location` and `breadcrumb`.
- `searchPlaceholder`, `searchValue`, `onSearchChangeText`, `onSearchPillPress` — search variants.

## Tokens

| Slot | Token |
|---|---|
| Container surface | `colour.surface.primary` |
| Container padding | `space["8"]` v / `space["12"]` h |
| Container height | 56 (64 for `search-bar`) |
| Title | `Heading/H16/Bold` (`title`), `Body/B16/SemiBold` (`title-center`) |
| Subtitle | `Body/B12/Regular`, `text-n-icon.secondary` |
| Address label | `Body/B16/SemiBold` |
| Crumb head | `Body/B14/SemiBold` |
| Crumb path | `Body/B14/Regular`, `text-n-icon.secondary` |
| Search field | `surface.tertiary`, `radius["12"]`, `Body/B14/Regular` |
| Search pill | `surface.tertiary`, `radius.rounded`, `border.subtle` 1px |

Leading and trailing affordances delegate to `IconButton` (`H40` `Default`, `Ghost` for `back-only`).

## Notes

- Always exactly one `PageHeader` per screen, anchored below the status bar.
- Don't combine `search-bar` and `search-pill*` in the same screen — pick one based on whether search is inline or tap-to-open.
- Trailing icon order should match consistent app-wide priority (e.g. search, saved, share, more) so muscle memory works across screens.
- `M-SearchBar` and `M-SearchPill` aren't in this package yet; the `search-bar` / `search-pill` / `search-pill-wide` variants render inline approximations. Swap to those primitives when they ship — no API change required here.
