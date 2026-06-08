import { forwardRef, type ElementRef } from "react";
import {
  Platform,
  View,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colour } from "@field-ds/tokens";

export type DividerRef = ElementRef<typeof View>;

// Dashed-line geometry for the Android fallback. iOS/web render the dashes via
// `borderStyle: "dashed"`, but on Android a dashed single-side border renders
// unreliably (often as solid), so there we lay out a row of short segments.
const DASH_LENGTH = 4;
const DASH_GAP = 3;

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
export const Divider = forwardRef<DividerRef, DividerProps>(function Divider(
  {
    variant = "solid",
    emphasis = "low",
    width = "100%",
    paddingLeft = 0,
    paddingRight = 0,
    style,
  },
  ref,
) {
  const lineColor =
    emphasis === "high" ? colour.border.primary : colour.border.subtle;

  // The dashed variant relies on `borderStyle: "dashed"`, which renders
  // reliably on iOS and web but not on Android (single-side dashed borders are
  // frequently drawn solid). On Android we instead tile fixed-width segments
  // across a clipped row. The solid variant is identical on every platform.
  const line =
    variant === "dashed" && Platform.OS === "android" ? (
      <View
        style={{
          height: 1,
          width: "100%",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {Array.from({
          // Cap the count so an unbounded loop can't run on very wide dividers;
          // 256 segments comfortably spans any realistic divider width.
          length: 256,
        }).map((_, i) => (
          <View
            key={i}
            style={{
              width: DASH_LENGTH,
              height: 1,
              marginRight: DASH_GAP,
              backgroundColor: lineColor,
            }}
          />
        ))}
      </View>
    ) : (
      <View
        style={{
          height: 1,
          width: "100%",
          borderTopWidth: 1,
          borderTopColor: lineColor,
          borderStyle: variant,
        }}
      />
    );

  return (
    <View
      ref={ref}
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
      {line}
    </View>
  );
});
