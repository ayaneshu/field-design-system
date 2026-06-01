/**
 * Contextual "what are you improving?" options. Because I NEED… now lives inside
 * the Field playground, an Improvement request can point at the exact existing
 * item — a component, an icon, a colour token or a type style — pulled straight
 * from the design system's own data.
 */
import { iconNames } from "@field-ds/icons";
import { colour, textStyles } from "@field-ds/tokens";

import type { Option } from "./fields";

// Component display names (mirrors the Components sidebar).
const COMPONENTS = [
  "Accordion",
  "ActionBar",
  "BottomNav",
  "BottomSheet",
  "Primary Button",
  "Secondary Button",
  "Secondary Neutral Button",
  "Neutral Button",
  "Icon Button",
  "Round Button",
  "Text Button",
  "Text Neutral Button",
  "Checkbox",
  "Divider",
  "Filter Chip",
  "Info Banner",
  "Input Text",
  "Input Textarea",
  "List Item",
  "Page Header",
  "Radio",
  "Rating Input",
  "Search Bar",
  "Switch",
  "Toggle",
];

// Semantic colour tokens, flattened to "group/name".
const COLOURS: string[] = (() => {
  const groups = ["text-n-icon", "surface", "border"] as const;
  const out: string[] = [];
  for (const g of groups) {
    const obj = colour[g] as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === "string") out.push(`${g}/${k}`);
    }
  }
  return out;
})();

const TYPOGRAPHY = Object.keys(textStyles);

const toOptions = (list: string[]): Option[] => list.map((n) => ({ value: n, label: n }));

/** Options for the contextual "target" dropdown, keyed by the chosen category. */
export function targetOptionsFor(category: string): Option[] {
  switch (category) {
    case "Components":
      return toOptions(COMPONENTS);
    case "Icon":
      return toOptions([...iconNames].sort());
    case "Colour":
      return toOptions(COLOURS);
    case "Typography":
      return toOptions(TYPOGRAPHY);
    default:
      return [];
  }
}

/** Label/placeholder for the contextual dropdown, keyed by category. */
export function targetMeta(category: string): { label: string; placeholder: string } {
  switch (category) {
    case "Components":
      return { label: "Which component?", placeholder: "Select a component" };
    case "Icon":
      return { label: "Which icon?", placeholder: "Search icons…" };
    case "Colour":
      return { label: "Which colour?", placeholder: "Select a colour token" };
    case "Typography":
      return { label: "Which type style?", placeholder: "Select a type style" };
    default:
      return { label: "Which item?", placeholder: "Select" };
  }
}
