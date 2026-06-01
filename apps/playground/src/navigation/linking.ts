import type { LinkingOptions } from "@react-navigation/native";

import type { RootStackParamList } from "./types";

/**
 * URL ↔ screen mapping. React Navigation's `linking` integration syncs
 * the browser address bar with the navigation stack: visiting a deep URL
 * routes to the right screen, calling `navigation.navigate(...)` updates
 * the URL, and the browser back / forward buttons walk the stack.
 *
 * The Vercel rewrite (`vercel.json`) ensures every non-asset request
 * serves `/index.html`, so direct visits to e.g. `/components/checkbox`
 * load the SPA and `linking.getStateFromPath` puts it on the right screen.
 *
 * Path conventions:
 *   - kebab-case in URLs (`/components/filter-chip`)
 *   - Foundations sub-sections sit beneath the parent  (`/foundations/colours`)
 *   - The seven Button variants are grouped under `/components/button/*`
 */
export const linking: LinkingOptions<RootStackParamList> = {
  // The prefixes are advisory on web (the matcher reads `window.location`),
  // but listing the production + a localhost dev origin keeps the linking
  // config explicit and works correctly for native deep-links too.
  prefixes: [
    "https://field-ds-playground.vercel.app",
    "http://localhost:8081",
  ],
  config: {
    screens: {
      Home: "",
      Foundations: {
        // Optional trailing segment so both `/foundations` and
        // `/foundations/colours` route to the same screen with the right
        // `section` param.
        path: "foundations/:section?",
        parse: {
          section: (raw: string) => decodeSection(raw),
        },
        stringify: {
          section: (s) => (s ? encodeSection(s) : ""),
        },
      },
      Illustrations: "illustrations",
      Components: "components",
      Patterns: "patterns",
      // "I need…" — the Field DS request collector (ported from the Next.js app).
      INeed: "i-need",
      INeedRequests: "i-need/requests",
      // Buttons grouped under /components/button/* to mirror the sidebar's
      // collapsible Button section.
      PrimaryButton: "components/button/primary",
      SecondaryButton: "components/button/secondary",
      SecondaryNeutralButton: "components/button/secondary-neutral",
      NeutralButton: "components/button/neutral",
      RoundButton: "components/button/round",
      TextButton: "components/button/text",
      NeutralTextButton: "components/button/text-neutral",
      IconButton: "components/button/icon",
      // All other components flatten under /components/*.
      Accordion: "components/accordion",
      ActionBar: "components/action-bar",
      BottomNav: "components/bottom-nav",
      BottomSheet: "components/bottom-sheet",
      Checkbox: "components/checkbox",
      Divider: "components/divider",
      FilterChip: "components/filter-chip",
      InfoBanner: "components/info-banner",
      InputText: "components/input-text",
      InputTextarea: "components/input-textarea",
      ListItem: "components/list-item",
      PageHeader: "components/page-header",
      Radio: "components/radio",
      RatingInput: "components/rating-input",
      SearchBar: "components/search-bar",
      Switch: "components/switch",
      Toggle: "components/toggle",
    },
  },
};

// The `colors` section is canonically rendered in URLs as `colours` so the
// public-facing URL matches the British spelling used in the UI ("Colours"
// in the sidebar, "colours" in the page title). The TypeScript enum value
// stays `colors` for API compatibility with the existing screen code.
const SECTION_URL_ALIASES: Record<string, string> = {
  colors: "colours",
};
const SECTION_URL_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(SECTION_URL_ALIASES).map(([k, v]) => [v, k]),
);

function decodeSection(raw: string): string {
  return SECTION_URL_REVERSE[raw] ?? raw;
}
function encodeSection(value: string): string {
  return SECTION_URL_ALIASES[value] ?? value;
}
