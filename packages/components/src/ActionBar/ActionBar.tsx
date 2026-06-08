import { type ReactNode } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colour, space, textStyles } from "@field-ds/tokens";

import {
  NeutralButton,
  PrimaryButton,
  SecondaryButton,
  SecondaryNeutralButton,
} from "../Button";

// Figma: M-ActionBar (698:11068, 1735:119). Stacks one or two CTAs above an
// optional content slot, or pairs a leading content slot with a trailing
// button. Designed to drop into the footer of M-BottomSheet (and other
// sheet-style surfaces).
//
// Layouts × tones = 8 variants:
//   single             — 1 button, full-width
//   stacked            — 2 buttons stacked, full-width (primary on top)
//   split              — 2 buttons side-by-side, flex 1 each (secondary | primary)
//   leadingTrailing    — leading slot (flex 1) + trailing button (compact, H48)
//
//   tone = "action"    — PrimaryButton + SecondaryButton (filled blue + outline blue)
//   tone = "neutral"   — NeutralButton + SecondaryNeutralButton (filled near-black + outline neutral)

export type ActionBarLayout =
  | "single"
  | "stacked"
  | "split"
  | "leadingTrailing";

export type ActionBarTone = "action" | "neutral";

export type ActionBarProps = {
  /** Layout variant. Default `"single"`. */
  layout?: ActionBarLayout;
  /** Colour tone for the contained buttons. Default `"action"`. */
  tone?: ActionBarTone;

  /** Slot above the buttons for `single` / `stacked`. */
  topSlot?: ReactNode;
  /** Leading content for `split` / `leadingTrailing` — rendered to the left of the buttons. */
  leading?: ReactNode;
  /** Toggle the optional slot for `single` / `stacked` / `split`. `leadingTrailing` always renders the leading slot. Default false — opt in to show the slot (and its placeholder when no content is supplied). */
  showSlot?: boolean;

  /** Primary CTA label (the dominant button — `Primary` or `Neutral` per tone). */
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;

  /** Secondary CTA label — used by `stacked` / `split`. */
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  secondaryLoading?: boolean;
  secondaryDisabled?: boolean;

  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * M-ActionBar — footer block that pairs a CTA (or two) with an optional
 * content slot. Use inside `BottomSheet` and other footer surfaces.
 *
 *   <ActionBar layout="single" primaryLabel="Continue" onPrimaryPress={…} />
 *   <ActionBar layout="stacked" primaryLabel="Save" secondaryLabel="Cancel" />
 *   <ActionBar layout="split" tone="neutral" primaryLabel="Apply" secondaryLabel="Reset" />
 *   <ActionBar layout="leadingTrailing"
 *     leading={<Price />}
 *     primaryLabel="Add to cart"
 *   />
 */
export function ActionBar({
  layout = "single",
  tone = "action",
  topSlot,
  leading,
  showSlot = false,
  primaryLabel = "Continue",
  onPrimaryPress,
  primaryLoading,
  primaryDisabled,
  secondaryLabel = "Cancel",
  onSecondaryPress,
  secondaryLoading,
  secondaryDisabled,
  accessibilityLabel,
  style,
}: ActionBarProps) {
  const isHorizontal = layout === "split" || layout === "leadingTrailing";
  const rowGap = layout === "leadingTrailing" ? space["8"] : space["12"];
  const columnGap = space["12"];

  const isCompact = layout === "leadingTrailing";
  const primarySize = isCompact ? "H48" : "H52";
  const secondarySize = isCompact ? "H48" : "H52";

  const renderPrimary = (flexed: boolean) => {
    const common = {
      label: primaryLabel,
      onPress: onPrimaryPress,
      loading: primaryLoading,
      disabled: primaryDisabled,
      fullWidth: true,
    } as const;
    const node =
      tone === "action" ? (
        <PrimaryButton {...common} size={primarySize} />
      ) : (
        <NeutralButton {...common} size={primarySize} />
      );
    return flexed ? <View style={{ flex: 1, minWidth: 0 }}>{node}</View> : node;
  };

  const renderSecondary = (flexed: boolean) => {
    const common = {
      label: secondaryLabel,
      onPress: onSecondaryPress,
      loading: secondaryLoading,
      disabled: secondaryDisabled,
      fullWidth: true,
    } as const;
    const node =
      tone === "action" ? (
        <SecondaryButton {...common} size={secondarySize} />
      ) : (
        <SecondaryNeutralButton {...common} size={secondarySize} />
      );
    return flexed ? <View style={{ flex: 1, minWidth: 0 }}>{node}</View> : node;
  };

  const TopSlot = ({ kind }: { kind: "top" | "leading" }) => {
    const content =
      kind === "top" ? topSlot : leading;
    if (content) return <>{content}</>;
    return (
      <View
        style={{
          flex: 1,
          minWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: space["12"],
          paddingVertical: space["6"],
        }}
      >
        <Text
          style={[
            textStyles.B12_Medium,
            { color: colour["text-n-icon"].tertiary, textAlign: "center" },
          ]}
        >
          {kind === "top"
            ? "Drop your custom content here"
            : "Drop your content here"}
        </Text>
      </View>
    );
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      // @ts-expect-error — dataSet on web only
      dataSet={{ component: "ActionBar", layout, tone }}
      style={[
        {
          width: "100%",
          backgroundColor: colour.surface.primary,
          padding: space["12"],
          flexDirection: isHorizontal ? "row" : "column",
          alignItems: "center",
          gap: isHorizontal ? rowGap : columnGap,
        },
        style,
      ]}
    >
      {/* Slot — top (single/stacked) or leading (split/leadingTrailing) */}
      {layout === "single" || layout === "stacked"
        ? showSlot
          ? (
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TopSlot kind="top" />
            </View>
          )
          : null
        : null}

      {(layout === "split" && showSlot) || layout === "leadingTrailing" ? (
        <View
          style={{
            flex: 1,
            minWidth: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TopSlot kind="leading" />
        </View>
      ) : null}

      {/* Buttons */}
      {layout === "single" ? renderPrimary(false) : null}

      {layout === "stacked" ? (
        <>
          {renderPrimary(false)}
          {renderSecondary(false)}
        </>
      ) : null}

      {layout === "split" ? (
        <>
          {renderSecondary(true)}
          {renderPrimary(true)}
        </>
      ) : null}

      {layout === "leadingTrailing" ? renderPrimary(true) : null}
    </View>
  );
}
