import type { ReactNode } from "react";
import {
  I18nManager,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colour, space, textStyles } from "@field-ds/tokens";

// Sizes lifted from the Figma M-List-Item spec.
const PADDING = space["12"];           // outer padding (header & row)
const ROW_GAP = space["8"];            // leading ↔ body ↔ trailing
const BODY_GAP = space["2"];           // title ↔ subtitle
const TITLE_GAP = space["8"];          // title ↔ titleSlot
const LEADING_SIZE = 24;               // 24×24 leading slot
const TITLE_SLOT_SIZE = 16;            // 16×16 inline badge slot

export type ListItemSize = "small" | "big";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  size?: ListItemSize;
  /**
   * Leading 24×24 slot — pass an Icon, avatar, Checkbox, badge, or any
   * custom node. The component reserves a 24×24 box and centers what's
   * rendered inside. Omit to hide the leading column.
   */
  leading?: ReactNode;
  /** Inline 16×16 slot to the right of the title (badge, status dot). */
  titleSlot?: ReactNode;
  /** Trailing slot (chevron, Switch, button, close). Right-aligned. */
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-ListItem — atomic stackable row primitive.
 *
 *   <ListItem title="Address" subtitle="123 Main St" leading={<Icon name="..." />} />
 *
 * Slots:
 *   - leading (24×24): icon, avatar, Checkbox, flag, or any custom node
 *   - titleSlot (16×16, inline): badge, status dot, tooltip icon
 *   - subtitle: optional second line
 *   - trailing: chevron, Switch, button, close — right-aligned
 *
 * Density:
 *   - "small" (default): B14 SemiBold title
 *   - "big": H16 Bold title
 *
 * When `onPress` is provided the row becomes pressable with a press-down
 * opacity dip; otherwise it renders as a plain View.
 */
export function ListItem({
  title,
  subtitle,
  size = "small",
  leading,
  titleSlot,
  trailing,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: ListItemProps) {
  const titleStyle =
    size === "big" ? textStyles.H16_Bold : textStyles.B14_SemiBold;

  const baseRowStyle: ViewStyle = {
    backgroundColor: colour.surface.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: ROW_GAP,
    paddingHorizontal: PADDING,
    paddingVertical: PADDING,
  };

  const content = (
    <>
      {leading != null && (
        <View
          // @ts-expect-error — dataSet on web
          dataSet={{ slot: "leading", tokenSize: "24" }}
          style={{
            width: LEADING_SIZE,
            height: LEADING_SIZE,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {leading}
        </View>
      )}

      <View
        // @ts-expect-error — dataSet on web
        dataSet={{ slot: "body", tokenGap: "space.2" }}
        style={{
          flex: 1,
          flexDirection: "column",
          gap: BODY_GAP,
          minWidth: 0,
        }}
      >
        <View
          // @ts-expect-error — dataSet on web
          dataSet={{ slot: "title-row", tokenGap: "space.8" }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: TITLE_GAP,
          }}
        >
          <Text
            numberOfLines={1}
            // @ts-expect-error — dataSet on Text on web
            dataSet={{
              tokenTextStyle:
                size === "big"
                  ? "textStyles.H16_Bold"
                  : "textStyles.B14_SemiBold",
              tokenColor: "colour.text-n-icon.primary",
            }}
            style={[
              titleStyle,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {title}
          </Text>
          {titleSlot != null && (
            <View
              // @ts-expect-error — dataSet on web
              dataSet={{ slot: "title-slot", tokenSize: "16" }}
              style={{
                width: TITLE_SLOT_SIZE,
                height: TITLE_SLOT_SIZE,
                flexShrink: 0,
              }}
            >
              {titleSlot}
            </View>
          )}
        </View>
        {subtitle != null && (
          <Text
            numberOfLines={2}
            // @ts-expect-error — dataSet on Text on web
            dataSet={{
              tokenTextStyle: "textStyles.B12_Regular",
              tokenColor: "colour.text-n-icon.secondary",
            }}
            style={[
              textStyles.B12_Regular,
              { color: colour["text-n-icon"].secondary },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {trailing != null && (
        <View
          // @ts-expect-error — dataSet on web
          dataSet={{ slot: "trailing" }}
          style={[
            { flexShrink: 0, alignItems: "flex-end" },
            // Mirror the trailing affordance under RTL so a disclosure
            // chevron/arrow points toward the (now-flipped) leading edge.
            // The leading/trailing columns themselves already swap sides via
            // the row's auto-mirrored flexDirection.
            I18nManager.isRTL && { transform: [{ scaleX: -1 }] },
          ]}
        >
          {trailing}
        </View>
      )}
    </>
  );

  const a11yLabel =
    accessibilityLabel ?? (subtitle ? `${title}, ${subtitle}` : title);

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint={accessibilityHint}
        // @ts-expect-error — RN Web supports dataSet on Pressable
        dataSet={{
          component: "ListItem",
          tokenBg: "colour.surface.primary",
          tokenPadding: "space.12",
          tokenGap: "space.8",
        }}
        style={({ pressed }) => [
          baseRowStyle,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      // @ts-expect-error — dataSet on web
      dataSet={{
        component: "ListItem",
        tokenBg: "colour.surface.primary",
        tokenPadding: "space.12",
        tokenGap: "space.8",
      }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[baseRowStyle, style]}
    >
      {content}
    </View>
  );
}
