/**
 * I NEED… button — RN port of components/field/Button.tsx.
 * Variants: neutral (navy fill), primary (blue fill), white (white fill),
 * outline / outlineDark (bordered). Web gets a soft lift-on-hover.
 */
import type { ReactNode } from "react";
import { Platform, Pressable, Text, type StyleProp, type ViewStyle } from "react-native";

import { c, ts } from "./tokens";

type Variant = "neutral" | "outlineDark" | "outline" | "white" | "primary";

export function Button({
  children,
  variant = "neutral",
  fullWidth,
  disabled,
  onPress,
  iconLeft,
  iconRight,
  style,
  textStyle,
}: {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: object;
}) {
  const variants: Record<Variant, { bg: string; fg: string; border: string }> = {
    neutral: { bg: c.surfaceInverted, fg: "#ffffff", border: "transparent" },
    primary: { bg: c.action, fg: "#ffffff", border: "transparent" },
    outlineDark: { bg: "transparent", fg: "#ffffff", border: c.borderBold },
    // Light hero CTA: transparent fill, navy label, medium grey border.
    outline: { bg: "transparent", fg: c.textPrimary, border: c.borderMedium },
    // Solid white, borderless — the primary light-hero CTA.
    white: { bg: "#ffffff", fg: c.textPrimary, border: "transparent" },
  };
  const v = variants[variant];
  const isWeb = Platform.OS === "web";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      // @ts-expect-error rn-web passes `hovered` to the style callback
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingVertical: 18,
          paddingHorizontal: 24,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: v.border,
          backgroundColor: v.bg,
          width: fullWidth ? "100%" : undefined,
          opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
          // Lift on hover, settle on press.
          transform: [{ translateY: hovered && !disabled && !pressed ? -2 : 0 }, { scale: pressed ? 0.985 : 1 }],
          ...(isWeb
            ? {
                // @ts-expect-error web-only CSS props passed through to the DOM
                // Flat at rest; a subtle lift-shadow only on hover.
                boxShadow:
                  hovered && !disabled
                    ? "0 6px 16px rgba(16,22,40,0.10)"
                    : "0 0px 0px rgba(16,22,40,0)",
                transitionProperty: "transform, box-shadow, background-color, border-color",
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                cursor: disabled ? "not-allowed" : "pointer",
              }
            : null),
        },
        style,
      ]}
    >
      {iconLeft}
      <Text style={[ts("Action_A17_SemiBold"), { color: v.fg }, textStyle]}>
        {children}
      </Text>
      {iconRight}
    </Pressable>
  );
}
