import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Icon, type IconName } from "@field-ds/icons";
import { colour, radius, space, textStyles } from "@field-ds/tokens";

/**
 * Curated system-icon set for every button playground picker. Covers the
 * common button-glyph cases (directional arrows, plus, search, edit, etc.)
 * without overwhelming the dropdown.
 */
export const ICON_OPTIONS: IconName[] = [
  "system-plus",
  "system-arrow-right",
  "system-arrow-left",
  "system-arrow-up",
  "system-arrow-down",
  "system-chevron-right",
  "system-chevron-left",
  "system-search",
  "system-edit",
  "system-bag",
  "system-heart",
  "system-bin",
  "system-info-circle",
  "system-check-circle",
  "system-message",
];

/**
 * Icon dropdown — a select-style trigger that shows the current icon glyph +
 * its slug, opens a floating menu where each row pairs the icon preview with
 * its name. "None" sits at the top to clear the selection.
 *
 * Built with absolute positioning instead of RN's Modal — the Modal route
 * had close-on-select issues on RN-Web (the row's setOpen race with the
 * parent re-render kept the modal mounted). A fixed-position click-away
 * backdrop handles outside dismissal cleanly.
 *
 * The trigger View raises its zIndex while open so the menu paints above
 * sibling DetailSection rows and any later content with its own implicit
 * stacking context (e.g. ScrollView's transform layer on rn-web).
 */
export function IconPicker({
  value,
  onChange,
}: {
  value: IconName | null;
  onChange: (next: IconName | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = value ?? "None";

  // Single handler for row taps so closing happens in the same React batch
  // as the value change. Avoids "menu stays open after select" races.
  const select = (next: IconName | null) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <View
      style={{
        position: "relative",
        minWidth: 220,
        zIndex: open ? 1000 : ("auto" as unknown as number),
      }}
    >
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Pick icon — current: ${label}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          paddingVertical: space["8"],
          paddingHorizontal: space["12"],
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: open ? colour.border.action : colour.border.primary,
          backgroundColor: colour.surface.primary,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space["8"],
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value ? (
              <Icon
                name={value}
                size={16}
                color={colour["text-n-icon"].primary}
              />
            ) : (
              <View
                style={{
                  width: 12,
                  height: 1,
                  backgroundColor: colour["text-n-icon"].tertiary,
                }}
              />
            )}
          </View>
          <Text
            numberOfLines={1}
            style={[
              textStyles.Body_B12_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {label}
          </Text>
        </View>
        <Icon
          name="system-chevron-down"
          size={16}
          color={colour["text-n-icon"].tertiary}
        />
      </Pressable>

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            accessibilityLabel="Close icon picker"
            // @ts-expect-error — `position: "fixed"` is web-only; RN ignores it.
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: space["6"],
              width: 280,
              maxHeight: 360,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["12"],
              borderWidth: 1,
              borderColor: colour.border.primary,
              paddingVertical: space["4"],
              zIndex: 9999,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <ScrollView
              style={{ maxHeight: 352 }}
              showsVerticalScrollIndicator
            >
              <DropdownRow
                label="None"
                active={value === null}
                onPress={() => select(null)}
              />
              {ICON_OPTIONS.map((name) => (
                <DropdownRow
                  key={name}
                  iconName={name}
                  label={name}
                  active={value === name}
                  onPress={() => select(name)}
                />
              ))}
            </ScrollView>
          </View>
        </>
      ) : null}
    </View>
  );
}

/**
 * Icon-only variant of {@link IconPicker} — no "None" row, since IconButton
 * always requires a glyph. Shares the same trigger + popup chrome as the
 * nullable picker so the controls UI stays consistent.
 */
export function RequiredIconPicker({
  value,
  onChange,
}: {
  value: IconName;
  onChange: (next: IconName) => void;
}) {
  const [open, setOpen] = useState(false);

  const select = (next: IconName) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <View
      style={{
        position: "relative",
        minWidth: 220,
        zIndex: open ? 1000 : ("auto" as unknown as number),
      }}
    >
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`Pick icon — current: ${value}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: space["8"],
          paddingVertical: space["8"],
          paddingHorizontal: space["12"],
          borderRadius: radius["8"],
          borderWidth: 1,
          borderColor: open ? colour.border.action : colour.border.primary,
          backgroundColor: colour.surface.primary,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: space["8"],
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={value}
              size={16}
              color={colour["text-n-icon"].primary}
            />
          </View>
          <Text
            numberOfLines={1}
            style={[
              textStyles.Body_B12_SemiBold,
              { color: colour["text-n-icon"].primary, flex: 1 },
            ]}
          >
            {value}
          </Text>
        </View>
        <Icon
          name="system-chevron-down"
          size={16}
          color={colour["text-n-icon"].tertiary}
        />
      </Pressable>

      {open ? (
        <>
          <Pressable
            onPress={() => setOpen(false)}
            accessibilityLabel="Close icon picker"
            // @ts-expect-error — `position: "fixed"` is web-only; RN ignores it.
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: space["6"],
              width: 280,
              maxHeight: 360,
              backgroundColor: colour.surface.primary,
              borderRadius: radius["12"],
              borderWidth: 1,
              borderColor: colour.border.primary,
              paddingVertical: space["4"],
              zIndex: 9999,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <ScrollView
              style={{ maxHeight: 352 }}
              showsVerticalScrollIndicator
            >
              {ICON_OPTIONS.map((name) => (
                <DropdownRow
                  key={name}
                  iconName={name}
                  label={name}
                  active={value === name}
                  onPress={() => select(name)}
                />
              ))}
            </ScrollView>
          </View>
        </>
      ) : null}
    </View>
  );
}

function DropdownRow({
  iconName,
  label,
  active,
  onPress,
}: {
  iconName?: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: space["12"],
        paddingVertical: space["10"],
        paddingHorizontal: space["12"],
        backgroundColor: active
          ? colour.surface["action-subtle"]
          : pressed
            ? colour.surface.secondary
            : "transparent",
      })}
    >
      <View
        style={{
          width: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconName ? (
          <Icon
            name={iconName}
            size={20}
            color={
              active
                ? colour["text-n-icon"].action
                : colour["text-n-icon"].primary
            }
          />
        ) : (
          // "None" placeholder — a neutral dash glyph in the icon slot so the
          // text alignment matches every other row.
          <View
            style={{
              width: 12,
              height: 1.5,
              backgroundColor: colour["text-n-icon"].tertiary,
            }}
          />
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[
          textStyles.Body_B14_Medium,
          {
            color: active
              ? colour["text-n-icon"].action
              : colour["text-n-icon"].primary,
            flex: 1,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
