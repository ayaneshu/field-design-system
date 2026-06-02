import { useId } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { Icon, type IconName } from "@field-ds/icons";
import { base, colour, radius, space, textStyles } from "@field-ds/tokens";

// Maps to Figma M-InfoBannerRounded (1337:69). Single-line status pill that
// sits inline beside product info, CTAs, or list rows — verified seller,
// arrival ETAs, promo tags, low-stock nudges. Non-interactive: no press
// feedback, no focus, no tap target. For full-width page banners use
// M-InfoBanner/Partial. For compact filter chips with a tap target use
// M-FilterChip.
//
// Background is a left-to-right linear gradient from the colour's subtle
// surface tint to white — matches Figma's `bg-gradient-to-r from-…-subtle
// to-white` treatment. Rendered with react-native-svg so the same gradient
// shows up on iOS, Android, and web (rn-web).
//
// Variants:
//   - color   "green" | "grey" | "blue" | "orange" | "supermall" | "purple" | "red"
//   - size    "small" | "large"           — drives padding, gap, icon, text style
//   - shape   "rounded" | "rectangular"   — radius/rounded vs radius/6
//   - showIcon true | false               — toggle leading glyph
//
// Tokens (resolved through @field-ds/tokens):
//   surface     colour.surface[*-subtle] / base.colour.purple["100"] (purple)
//   foreground  colour["text-n-icon"][*] / base.colour.purple["700"] (purple)
//   radius      radius.rounded / radius["6"]
//   padding     space["8"] / space["6"] / space["4"]
//   gap         space["4"] / space["2"]
//   typography  textStyles.B11_Medium (small) / B12_Medium (large)

export type InfoBannerColor =
  | "green"
  | "grey"
  | "blue"
  | "orange"
  | "supermall"
  | "purple"
  | "red";

export type InfoBannerSize = "small" | "large";

export type InfoBannerShape = "rounded" | "rectangular";

export type InfoBannerProps = {
  /** Short status text. Single line, ~40 chars max — long copy breaks the
   *  pill shape. */
  label: string;
  /** Semantic intent. Drives surface tint and foreground colour together. */
  color?: InfoBannerColor;
  /** Compact (B11/Medium, 12-px icon) or roomier (B12/Medium, 14/18-px icon). */
  size?: InfoBannerSize;
  /** Pill (`radius/rounded`, the canonical shape) or block (`radius/6`). */
  shape?: InfoBannerShape;
  /** Toggle the leading icon. */
  showIcon?: boolean;
  /** Glyph rendered before the label. Defaults to `system-verified`. */
  icon?: IconName;
  /** Override for screen readers when the visible label is abbreviated. */
  accessibilityLabel?: string;
  /** Layout-level escape hatch on the outer container only. */
  style?: StyleProp<ViewStyle>;
};

type Surface = {
  bg: string;
  fg: string;
  bgToken: string;
  fgToken: string;
};

const SURFACES: Record<InfoBannerColor, Surface> = {
  green: {
    bg: colour.surface["success-subtle"],
    fg: colour["text-n-icon"].success,
    bgToken: "colour.surface.success-subtle",
    fgToken: "colour.text-n-icon.success",
  },
  grey: {
    bg: colour.surface.secondary,
    fg: colour["text-n-icon"].primary,
    bgToken: "colour.surface.secondary",
    fgToken: "colour.text-n-icon.primary",
  },
  blue: {
    bg: colour.surface["action-subtle"],
    fg: colour["text-n-icon"].action,
    bgToken: "colour.surface.action-subtle",
    fgToken: "colour.text-n-icon.action",
  },
  orange: {
    bg: colour.surface["warning-subtle"],
    fg: colour["text-n-icon"].warning,
    bgToken: "colour.surface.warning-subtle",
    fgToken: "colour.text-n-icon.warning",
  },
  supermall: {
    bg: colour.surface["supermall-subtle"],
    fg: colour["text-n-icon"].supermall,
    bgToken: "colour.surface.supermall-subtle",
    fgToken: "colour.text-n-icon.supermall",
  },
  purple: {
    bg: base.colour.purple["100"],
    fg: base.colour.purple["700"],
    bgToken: "base.colour.purple.100",
    fgToken: "base.colour.purple.700",
  },
  red: {
    bg: colour.surface["error-subtle"],
    fg: colour["text-n-icon"].error,
    bgToken: "colour.surface.error-subtle",
    fgToken: "colour.text-n-icon.error",
  },
};

type Geometry = {
  borderRadius: number;
  paddingLeft: number;
  paddingRight: number;
  paddingVertical: number;
  gap: number;
  iconSize: number;
  textStyle: typeof textStyles.B11_Medium | typeof textStyles.B12_Medium;
  textStyleName: "B11_Medium" | "B12_Medium";
};

// Small variants use asymmetric horizontal padding — the icon hugs the left
// edge (pl=4) and the trailing label gets more breathing room (pr=8 or 6).
// Large variants stay symmetric. Padding stays the same when `showIcon` is
// false so a label-only pill keeps its rhythm with the rest of the row.
function geometryFor(size: InfoBannerSize, shape: InfoBannerShape): Geometry {
  if (size === "small" && shape === "rounded") {
    return {
      borderRadius: radius.rounded,
      paddingLeft: space["4"],
      paddingRight: space["8"],
      paddingVertical: space["4"],
      gap: space["2"],
      iconSize: 14,
      textStyle: textStyles.B11_Medium,
      textStyleName: "B11_Medium",
    };
  }
  if (size === "small" && shape === "rectangular") {
    return {
      borderRadius: radius["6"],
      paddingLeft: space["4"],
      paddingRight: space["6"],
      paddingVertical: space["4"],
      gap: space["2"],
      iconSize: 14,
      textStyle: textStyles.B11_Medium,
      textStyleName: "B11_Medium",
    };
  }
  if (size === "large" && shape === "rounded") {
    return {
      borderRadius: radius.rounded,
      paddingLeft: space["8"],
      paddingRight: space["8"],
      paddingVertical: space["8"],
      gap: space["4"],
      iconSize: 18,
      textStyle: textStyles.B12_Medium,
      textStyleName: "B12_Medium",
    };
  }
  return {
    borderRadius: radius["6"],
    paddingLeft: space["6"],
    paddingRight: space["6"],
    paddingVertical: space["6"],
    gap: space["4"],
    iconSize: 18,
    textStyle: textStyles.B12_Medium,
    textStyleName: "B12_Medium",
  };
}

/**
 * M-InfoBanner — single-line status pill (Figma: M-InfoBannerRounded).
 *
 *   <InfoBanner label="Verified seller" />
 *   <InfoBanner label="Arrives Tue" color="blue" size="large" icon="system-calendar" />
 *   <InfoBanner label="Out of stock" color="red" showIcon={false} />
 *
 * Pick `color` by intent — green=success, red=error, orange=warning,
 * blue=info/action, grey=neutral, supermall=supermall, purple=loyalty.
 * Background fades from the colour's subtle tint on the left to white on
 * the right. Keep labels short — long copy will truncate.
 */
export function InfoBanner({
  label,
  color = "green",
  size = "small",
  shape = "rounded",
  showIcon = true,
  icon = "system-verified",
  accessibilityLabel,
  style,
}: InfoBannerProps) {
  const surface = SURFACES[color];
  const geom = geometryFor(size, shape);

  // Unique ID per instance — multiple InfoBanners on a page must not share
  // an SVG <LinearGradient> id, otherwise rn-web hands every banner the
  // first instance's gradient.
  const reactId = useId();
  const gradientId = `info-banner-grad-${reactId.replace(/:/g, "")}`;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
      // @ts-expect-error — dataSet on View on web
      dataSet={{
        component: "InfoBanner",
        color,
        size,
        shape,
      }}
      style={[
        {
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: geom.borderRadius,
          paddingLeft: geom.paddingLeft,
          paddingRight: geom.paddingRight,
          paddingVertical: geom.paddingVertical,
          gap: geom.gap,
          overflow: "hidden",
          // Solid fallback in case SVG fails to mount (e.g. transient
          // hydration on web). Visually identical to the gradient's left
          // stop, so the swap is invisible if/when the gradient paints.
          backgroundColor: surface.bg,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={surface.bg} stopOpacity="1" />
              <Stop
                offset="1"
                stopColor={colour.surface.primary}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        </Svg>
      </View>

      {showIcon ? (
        // zIndex pinned to 1 so the icon paints above the absolutely-
        // positioned gradient layer. Without this rn-web's CSS stacking
        // order puts the gradient on top and hides the glyph.
        <View style={{ zIndex: 1 }}>
          <Icon name={icon} size={geom.iconSize} color={surface.fg} />
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        // @ts-expect-error — dataSet on Text on web
        dataSet={{
          tokenTextStyle: geom.textStyleName,
          tokenColor: surface.fgToken,
          tokenBg: surface.bgToken,
        }}
        style={[geom.textStyle, { color: surface.fg, zIndex: 1 }]}
      >
        {label}
      </Text>
    </View>
  );
}
