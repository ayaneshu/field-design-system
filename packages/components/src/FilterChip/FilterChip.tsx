import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

// Maps to Figma M-FilterChip (1391:41). Height-36 filter / sort chip.
//   - content="label"  → preferences-style chip ("Filter ▼"). Independent
//                        left + right icon slots, optional count text in
//                        the Added state.
//   - content="slot"   → 40×36 chip with a 20×20 slot the consumer fills
//                        with any node (image, SVG, brand mark, custom view).
//
// Pressed visuals come from Pressable's `pressed` flag — there is no
// Pressed prop. `disabled` and `added` are exposed as standalone booleans
// so the runtime API maps cleanly to common filter-bar behaviour.
//
// Tokens (resolved through @field-ds/tokens):
//   - radius/8                    rounded corners
//   - space/10, space/8           padding (x, y)
//   - space/4                     gap between cluster items
//   - colour.surface.primary      Default / Added background
//   - colour.surface.secondary    Pressed / Disabled background
//   - colour.border.subtle        Default / Pressed / Disabled border
//   - colour.border.extrabold     Added border (1px black-ish hairline)
//   - colour.text-n-icon.primary  Default / Pressed / Added foreground
//   - colour.text-n-icon.muted    Disabled foreground

const HEIGHT = 36;
const SLOT_SIZE = 20;
const ICON_SIZE = 16;

export type FilterChipContent = "label" | "slot";

export type FilterChipProps = {
  /** Layout mode. `label` shows text + optional left/right icons; `slot`
   *  exposes a 20×20 child slot for an image, SVG or any custom node. */
  content?: FilterChipContent;
  /** Visible label. Verb-first, short ("Filter", "Sort", "Category"). */
  label?: string;
  /** Pre-formatted count rendered after the label when `added` is true
   *  (e.g. "(4)", "12"). The chip does not format this for you. */
  count?: string;
  /** Toggle the left icon. Defaults to on (renders `iconLeft`). */
  showIconLeft?: boolean;
  /** Toggle the right icon (caret). Defaults to on. Set false for static
   *  badges like a single applied filter pill. */
  showIconRight?: boolean;
  /** Glyph rendered before the label. Defaults to the preferences (filter)
   *  icon. */
  iconLeft?: IconName;
  /** Glyph rendered after the label. Defaults to caret-down. */
  iconRight?: IconName;
  /** Filters are applied. Switches to the bordered "Added" treatment, shows
   *  `count`, and exposes a clear-all cross handled by `onClear`. */
  added?: boolean;
  disabled?: boolean;
  /** Fires when the chip body is pressed (open the filter sheet / picker). */
  onPress?: () => void;
  /** Fires when the trailing clear-all cross is pressed. Only relevant when
   *  `added` is true. */
  onClear?: () => void;
  /** Children rendered inside the 20×20 slot when `content="slot"`. Can be
   *  an `<Image />`, `<Svg />` node, brand mark, or any custom view. */
  children?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

type Surface = {
  bg: string;
  bgPressed: string;
  border: string;
  fg: string;
  fgToken: string;
};

// Default / Pressed / Disabled all share the subtle border. Added is the
// only state that swaps to the extrabold (near-black) hairline.
const SURFACE_DEFAULT: Surface = {
  bg: colour.surface.primary,
  bgPressed: colour.surface.secondary,
  border: colour.border.subtle,
  fg: colour["text-n-icon"].primary,
  fgToken: "colour.text-n-icon.primary",
};

const SURFACE_DISABLED: Surface = {
  bg: colour.surface.secondary,
  bgPressed: colour.surface.secondary,
  border: colour.border.subtle,
  fg: colour["text-n-icon"].muted,
  fgToken: "colour.text-n-icon.muted",
};

const SURFACE_ADDED: Surface = {
  bg: colour.surface.primary,
  bgPressed: colour.surface.secondary,
  border: colour.border.extrabold,
  fg: colour["text-n-icon"].primary,
  fgToken: "colour.text-n-icon.primary",
};

/**
 * M-FilterChip — height-36 filter / sort chip.
 *
 *   <FilterChip label="Filter" onPress={openSheet} />
 *   <FilterChip label="Sort" iconLeft="system-sort" />
 *   <FilterChip label="Filter" count="(4)" added onPress={openSheet} onClear={clearAll} />
 *   <FilterChip content="slot" onPress={openSheet}>
 *     <Image source={brandLogo} style={{ width: 20, height: 20 }} />
 *   </FilterChip>
 *
 * `disabled` removes interactivity and applies the muted treatment. Prefer
 * hiding the chip entirely when the action is never available in context.
 */
export function FilterChip({
  content = "label",
  label = "Filter",
  count,
  showIconLeft = true,
  showIconRight = true,
  iconLeft = "system-preferences",
  iconRight = "system-caret-down",
  added = false,
  disabled = false,
  onPress,
  onClear,
  children,
  accessibilityLabel,
  style,
}: FilterChipProps) {
  const surface = disabled
    ? SURFACE_DISABLED
    : added
      ? SURFACE_ADDED
      : SURFACE_DEFAULT;

  const stateName = disabled ? "disabled" : added ? "added" : "default";

  const labelText = (
    <Text
      numberOfLines={1}
      // @ts-expect-error — dataSet on Text on web
      dataSet={{
        tokenTextStyle: "Action_A14_SemiBold",
        tokenColor: surface.fgToken,
      }}
      style={[textStyles.Action_A14_SemiBold, { color: surface.fg }]}
    >
      {label}
    </Text>
  );

  const countText =
    added && count ? (
      <Text
        numberOfLines={1}
        // @ts-expect-error — dataSet on Text on web
        dataSet={{
          tokenTextStyle: "Action_A14_SemiBold",
          tokenColor: surface.fgToken,
        }}
        style={[textStyles.Action_A14_SemiBold, { color: surface.fg }]}
      >
        {count}
      </Text>
    ) : null;

  const slotChild = (
    <View
      style={{
        width: SLOT_SIZE,
        height: SLOT_SIZE,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );

  const leftIcon =
    showIconLeft && content === "label" ? (
      <Icon name={iconLeft} size={ICON_SIZE} color={surface.fg} />
    ) : null;

  const rightIcon =
    showIconRight && content === "label" ? (
      <Icon name={iconRight} size={ICON_SIZE} color={surface.fg} />
    ) : null;

  // Single-Pressable layout covers every state except label+added (which
  // splits into body + clear-cross zones). Slot+added just swaps the border
  // colour — there's no clear affordance on the slot variant.
  if (!added || content === "slot") {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        // @ts-expect-error — dataSet on Pressable on web
        dataSet={{
          component: "FilterChip",
          content,
          state: stateName,
        }}
        style={({ pressed }) => [
          {
            minHeight: HEIGHT,
            maxHeight: HEIGHT,
            paddingHorizontal: space["10"],
            paddingVertical: space["8"],
            borderRadius: radius["8"],
            borderWidth: 1,
            borderColor: surface.border,
            backgroundColor:
              pressed && !disabled ? surface.bgPressed : surface.bg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "flex-start",
            gap: content === "slot" ? 0 : space["4"],
          },
          style,
        ]}
      >
        {content === "slot" ? slotChild : (
          <>
            {leftIcon}
            {labelText}
            {rightIcon}
          </>
        )}
      </Pressable>
    );
  }

  // Added state: the chip splits into two side-by-side hit zones inside a
  // single bordered View. Two Pressables let `onPress` and `onClear` fire
  // independently — and avoid nesting <button> inside <button> on web.
  return (
    <View
      // @ts-expect-error — dataSet on View on web
      dataSet={{
        component: "FilterChip",
        content,
        state: stateName,
      }}
      style={[
        {
          minHeight: HEIGHT,
          maxHeight: HEIGHT,
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: surface.border,
          backgroundColor: surface.bg,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        // @ts-expect-error — dataSet on Pressable on web
        dataSet={{ component: "FilterChip.Body" }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          paddingHorizontal: space["10"],
          paddingVertical: space["8"],
          gap: space["4"],
          backgroundColor:
            pressed && !disabled ? surface.bgPressed : "transparent",
        })}
      >
        {leftIcon}
        {labelText}
        {countText}
        {rightIcon}
      </Pressable>

      <View
        style={{
          width: 1,
          height: 14,
          backgroundColor: colour.border.subtle,
          borderRadius: radius["2"],
          marginHorizontal: space["2"],
        }}
      />

      <Pressable
        onPress={disabled ? undefined : onClear}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel="Clear filters"
        hitSlop={6}
        // @ts-expect-error — dataSet on Pressable on web
        dataSet={{ component: "FilterChip.Clear" }}
        style={({ pressed }) => ({
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
          paddingHorizontal: space["8"],
          backgroundColor:
            pressed && !disabled ? surface.bgPressed : "transparent",
        })}
      >
        <Icon name="system-cross" size={ICON_SIZE} color={surface.fg} />
      </Pressable>
    </View>
  );
}
