import { View, type StyleProp, type ViewStyle, type DimensionValue } from "react-native";

import { colour } from "@field-ds/tokens";

// Figma: M-Divider — horizontal hairline used to separate content into sections.
// Two styles (solid / dashed) × two emphasis levels (low / high).
export type DividerStyle = "solid" | "dashed";
export type DividerEmphasis = "low" | "high";

export type DividerProps = {
  /** Solid for standard separation; dashed for softer/optional breaks. */
  variant?: DividerStyle;
  /** Low is the default; high reserved for stronger structural separation. */
  emphasis?: DividerEmphasis;
  /**
   * Total width of the divider including its padding. Pass a number for px,
   * a percentage string ("100%"), or omit to fill the parent.
   */
  width?: DimensionValue;
  /** Inset from the left edge before the line starts. */
  paddingLeft?: number;
  /** Inset from the right edge before the line ends. */
  paddingRight?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-Divider — horizontal rule used to separate content into distinct sections.
 *
 *   <Divider />                                  // full-width, solid, low emphasis
 *   <Divider variant="dashed" emphasis="high" /> // dashed, stronger contrast
 *   <Divider width={240} paddingLeft={16} paddingRight={16} />
 *
 * The component renders a 1px hairline. `width` controls the overall span of
 * the divider; `paddingLeft` / `paddingRight` inset the line within that span,
 * which is the typical pattern when a divider sits inside a list row that
 * needs to align with content rather than container edges.
 */
export function Divider({
  variant = "solid",
  emphasis = "low",
  width = "100%",
  paddingLeft = 0,
  paddingRight = 0,
  style,
}: DividerProps) {
  const lineColor =
    emphasis === "high" ? colour.border.primary : colour.border.subtle;

  return (
    <View
      accessibilityRole={
        // RN-Web maps "separator" to the WAI-ARIA role; native ignores it.
        "separator" as never
      }
      // @ts-expect-error — dataSet on View on web for token traceability
      dataSet={{
        component: "Divider",
        tokenColor:
          emphasis === "high"
            ? "colour.border.primary"
            : "colour.border.subtle",
      }}
      style={[{ width, paddingLeft, paddingRight }, style]}
    >
      <View
        style={{
          height: 1,
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: lineColor,
          borderStyle: variant,
        }}
      />
    </View>
  );
}
